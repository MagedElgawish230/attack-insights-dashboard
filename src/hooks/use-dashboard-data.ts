import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { WebsiteData } from '@/data/mockData';
import { websites as mockWebsites } from '@/data/mockData';

export const useDashboardData = () => {
    const [websites, setWebsites] = useState<WebsiteData[]>(mockWebsites);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // If Supabase is not configured, fallback to mock data silently
                if (!supabase) {
                    console.warn("Supabase client not initialized. Using mock data.");
                    setIsLoading(false);
                    return;
                }

                setIsLoading(true);

                // Fetch ALL attacks (limit for safety)
                const { data: dbAttacks, error: attacksError } = await supabase
                    .from('attacks')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(1000);

                if (attacksError) throw attacksError;

                // 3. Transform Data to match WebsiteData interface
                if (dbAttacks) {
                    // Group attacks by target_url
                    const sitesMap = new Map<string, any[]>();

                    dbAttacks.forEach((attack: any) => {
                        const url = attack.target_url || 'unknown';
                        if (!sitesMap.has(url)) {
                            sitesMap.set(url, []);
                        }
                        sitesMap.get(url)?.push(attack);
                    });

                    const transformedData: WebsiteData[] = Array.from(sitesMap.entries()).map(([url, siteAttacks]) => {
                        // Infer name from the first attack that has it, or derived from URL
                        let hostname = 'Unknown Site';
                        try {
                            if (url !== 'unknown') {
                                hostname = new URL(url).hostname;
                            }
                        } catch (e) {
                            hostname = url; // Fallback to raw string if valid URL parse fails
                        }

                        const name = siteAttacks.find(a => a.target_name)?.target_name || hostname;

                        // Calculate stats from actual data
                        const totalThreats = siteAttacks.length;
                        const blockedThreats = siteAttacks.filter((a: any) => a.status?.toLowerCase() === 'blocked').length;

                        // Simple trend calculation (this vs previous period would be improved in full backend)
                        // For now we just return a static number or random trend to keep UI looking alive

                        // Group attacks by hour for trend
                        const attacksByHour: Record<string, { attacks: number, blocked: number }> = {};
                        siteAttacks.forEach((a: any) => {
                            const hour = new Date(a.created_at).getHours();
                            const timeKey = `${hour.toString().padStart(2, '0')}:00`;
                            if (!attacksByHour[timeKey]) attacksByHour[timeKey] = { attacks: 0, blocked: 0 };
                            attacksByHour[timeKey].attacks++;
                            if (a.status?.toLowerCase() === 'blocked') attacksByHour[timeKey].blocked++;
                        });

                        const attackTrend = Object.entries(attacksByHour).map(([key, val]) => ({
                            time: key,
                            attacks: val.attacks,
                            blocked: val.blocked
                        })).sort((a, b) => a.time.localeCompare(b.time));

                        // Trend Calculation (Current Hour vs Previous Hour)
                        const now = new Date();
                        const currentHourIdx = now.getHours();
                        const prevHourIdx = currentHourIdx === 0 ? 23 : currentHourIdx - 1;

                        const currentHourKey = `${currentHourIdx.toString().padStart(2, '0')}:00`;
                        const prevHourKey = `${prevHourIdx.toString().padStart(2, '0')}:00`;

                        const currentStats = attacksByHour[currentHourKey] || { attacks: 0, blocked: 0 };
                        const prevStats = attacksByHour[prevHourKey] || { attacks: 0, blocked: 0 };

                        const calculateTrend = (current: number, previous: number) => {
                            if (previous === 0) return current > 0 ? 100 : 0;
                            return Math.round(((current - previous) / previous) * 100);
                        };

                        const trend = calculateTrend(currentStats.attacks, prevStats.attacks);
                        const blockedTrend = calculateTrend(currentStats.blocked, prevStats.blocked);

                        // If no trend data, provide some empty defaults
                        if (attackTrend.length === 0) {
                            attackTrend.push({ time: "00:00", attacks: 0, blocked: 0 });
                        }

                        // Group by type
                        const typeCounts: Record<string, number> = {};
                        siteAttacks.forEach((a: any) => {
                            typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
                        });

                        const attackTypes = Object.entries(typeCounts).map(([name, value]) => ({
                            name,
                            value,
                            color: getColorForType(name)
                        }));

                        // Recent attacks mapping
                        const recentAttacks = siteAttacks.slice(0, 10).map((a: any) => ({
                            id: a.id,
                            type: a.type,
                            severity: a.severity,
                            ip: a.ip_address,
                            time: formatTimeAgo(new Date(a.created_at)),
                            status: a.status,
                            payload: a.payload || 'N/A'
                        }));

                        return {
                            id: url, // Use URL as ID for uniqueness in this view
                            name: name,
                            url: url,
                            stats: {
                                totalThreats: totalThreats.toLocaleString(),
                                threatsBlocked: blockedThreats.toLocaleString(),
                                activeProtection: totalThreats > 0 ? ((blockedThreats / totalThreats) * 100).toFixed(1) + "%" : "100%",
                                falsePositives: "0", // Placeholder until we have this data
                                avgResponseTime: "0.5ms", // Placeholder
                                protectedEndpoints: (new Set(siteAttacks.map((a: any) => {
                                    if (a.path) return a.path;
                                    try {
                                        return new URL(a.target_url).pathname;
                                    } catch {
                                        return null;
                                    }
                                }).filter(Boolean))).size.toString(),
                                modelAccuracy: "99.0%", // Placeholder
                                trend: trend,
                                blockedTrend: blockedTrend
                            },
                            attackTrend,
                            attackTypes,
                            recentAttacks
                        };
                    });

                    if (transformedData.length >= 0) {
                        setWebsites(transformedData);
                    }
                }
            } catch (err: any) {
                console.error("Error fetching dashboard data:", err);
                setError(err.message);
                // Fallback is already set to mockWebsites
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // Real-time subscription only if supabase is active
        if (supabase) {
            const subscription = supabase
                .channel('public:attacks')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'attacks' }, (payload) => {
                    console.log('New attack received!', payload);
                    // In a real app we'd optimise this to just append, but for now re-fetch is safer for consistency
                    fetchData();
                })
                .subscribe();

            return () => {
                supabase.removeChannel(subscription);
            };
        }
    }, []);

    return { websites, isLoading, error };
};

// Helpers
function getColorForType(type: string) {
    switch (type.toLowerCase()) {
        case 'sql injection': return "hsl(350 89% 60%)";
        case 'xss': return "hsl(38 92% 50%)";
        case 'command injection': return "hsl(45 100% 60%)";
        default: return "hsl(200 80% 50%)";
    }
}

function formatTimeAgo(date: Date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `Just now`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}
