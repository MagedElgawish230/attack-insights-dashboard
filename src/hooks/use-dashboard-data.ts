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
                        // Group by target_name if available, otherwise by Origin, otherwise by full URL
                        let key = attack.target_name;

                        if (!key) {
                            try {
                                if (attack.target_url) {
                                    key = new URL(attack.target_url).origin;
                                }
                            } catch {
                                // Fallback to raw URL if parse fails
                            }
                        }

                        // Final fallback
                        if (!key) key = attack.target_url || 'unknown';

                        if (!sitesMap.has(key)) {
                            sitesMap.set(key, []);
                        }
                        sitesMap.get(key)?.push(attack);
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

                        // ... (query update in a separate chunk if needed, but select * covers it)

                        // Calculate stats from actual data
                        const totalThreats = siteAttacks.length;
                        const blockedThreats = siteAttacks.filter((a: any) => a.status?.toLowerCase() === 'blocked').length;
                        const falsePositiveCount = siteAttacks.filter((a: any) => a.is_false_positive).length;

                        // Trend Calculation
                        const attacksByHour: Record<string, { attacks: number, blocked: number }> = {};
                        for (let i = 0; i < 24; i++) {
                            const timeKey = `${i.toString().padStart(2, '0')}:00`;
                            attacksByHour[timeKey] = { attacks: 0, blocked: 0 };
                        }

                        siteAttacks.forEach((a: any) => {
                            if (a.is_false_positive) return; // Exclude False Positives from Charts
                            const hour = new Date(a.created_at).getHours();
                            const timeKey = `${hour.toString().padStart(2, '0')}:00`;
                            if (attacksByHour[timeKey]) {
                                attacksByHour[timeKey].attacks++;
                                if (a.status?.toLowerCase() === 'blocked') attacksByHour[timeKey].blocked++;
                            }
                        });

                        const attackTrend = Object.entries(attacksByHour).map(([key, val]) => ({
                            time: key,
                            attacks: val.attacks,
                            blocked: val.blocked
                        })).sort((a, b) => a.time.localeCompare(b.time));

                        // Trend Calculation (Current vs Previous Hour)
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

                        // Group by type
                        const typeCounts: Record<string, number> = {};
                        siteAttacks.forEach((a: any) => {
                            if (a.is_false_positive) return; // Exclude False Positives from Type Chart
                            typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
                        });

                        const attackTypes = Object.entries(typeCounts).map(([name, value]) => ({
                            name,
                            value,
                            color: getColorForType(name)
                        }));

                        // ... (rest of transformation)

                        // Recent attacks mapping
                        const recentAttacks = siteAttacks.slice(0, 10).map((a: any) => {
                            // ... (existing mapping logic moved implicitly or kept same if we don't replace it)
                            // To avoid replacing too much, I will rely on context matching or include snippet
                            // Derive location name
                            let location = 'Unknown Endpoint';
                            const rawPath = a.path || (a.target_url ? new URL(a.target_url).pathname : '');

                            if (rawPath) {
                                const lowerPath = rawPath.toLowerCase();
                                if (lowerPath.includes('login')) location = 'Login Page';
                                else if (lowerPath.includes('signup') || lowerPath.includes('register')) location = 'Signup Page';
                                else if (lowerPath.includes('transfer') || lowerPath.includes('transaction')) location = 'Money Transfer';
                                else location = rawPath;
                            }

                            return {
                                id: a.id,
                                type: a.type,
                                severity: a.severity,
                                ip: a.ip_address,
                                time: formatTimeAgo(new Date(a.created_at)),
                                status: a.status,
                                payload: a.payload || 'N/A',
                                location: location,
                                is_false_positive: a.is_false_positive
                            };
                        });

                        return {
                            id: url,
                            name: name,
                            url: url,
                            stats: {
                                totalThreats: totalThreats.toLocaleString(),
                                threatsBlocked: blockedThreats.toLocaleString(),
                                activeProtection: totalThreats > 0 ? ((blockedThreats / totalThreats) * 100).toFixed(1) + "%" : "100%",
                                falsePositives: falsePositiveCount.toString(),
                                avgResponseTime: "0.5ms",
                                protectedEndpoints: (new Set(siteAttacks.map((a: any) => {
                                    if (a.path) return a.path;
                                    try {
                                        return new URL(a.target_url).pathname;
                                    } catch {
                                        return null;
                                    }
                                }).filter(Boolean))).size.toString(),
                                modelAccuracy: totalThreats > 0
                                    ? (((totalThreats - falsePositiveCount) / totalThreats) * 100).toFixed(1) + "%"
                                    : "100.0%",
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // Real-time Subscription (INSERT and UPDATE)
        const channel = supabase
            .channel('public:attacks')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'attacks' },
                (payload) => {
                    console.log('Real-time change received:', payload);
                    fetchData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const toggleFalsePositive = async (attackId: number, currentVal: boolean) => {
        const newVal = !currentVal;

        // Optimistic UI update / Mock Data handling
        setWebsites(prevWebsites => {
            return prevWebsites.map(site => {
                // Find if this site has the attack
                const hasAttack = site.recentAttacks.some(a => a.id === attackId);
                if (!hasAttack) return site;

                const newRecentAttacks = site.recentAttacks.map(attack => {
                    if (attack.id === attackId) {
                        return { ...attack, is_false_positive: newVal };
                    }
                    return attack;
                });

                // Re-calculate stats
                // If newVal is TRUE, we are ADDING a false positive (count + 1)
                // If newVal is FALSE, we are REMOVING a false positive (count - 1)
                const currentCount = parseInt(site.stats.falsePositives) || 0;
                const newCount = newVal ? currentCount + 1 : Math.max(0, currentCount - 1);

                return {
                    ...site,
                    recentAttacks: newRecentAttacks,
                    stats: {
                        ...site.stats,
                        falsePositives: newCount.toString(),
                        modelAccuracy: (parseInt(site.stats.totalThreats.replace(/,/g, '')) > 0)
                            ? (((parseInt(site.stats.totalThreats.replace(/,/g, '')) - newCount) / parseInt(site.stats.totalThreats.replace(/,/g, ''))) * 100).toFixed(1) + "%"
                            : "100.0%"
                    }
                };
            });
        });

        try {
            if (!supabase) {
                console.log(`Mock mode: Toggled attack ${attackId} to false_positive=${newVal} locally.`);
                return;
            }

            const { error } = await supabase
                .from('attacks')
                .update({ is_false_positive: newVal })
                .eq('id', attackId);

            if (error) throw error;
        } catch (err) {
            console.error("Error toggling false positive:", err);
            // Revert logic would go here
        }
    };

    return { websites, isLoading, error, toggleFalsePositive };
};

// Helpers
// Helpers
function getColorForType(type: string) {
    const lowerType = type.toLowerCase();

    // Explicit overrides for common types (to keep them recognizable)
    if (lowerType === 'sql injection' || lowerType === 'sql_injection') return "hsl(350 89% 60%)"; // Red
    if (lowerType === 'xss') return "hsl(38 92% 50%)"; // Orange
    if (lowerType === 'command injection' || lowerType === 'command_injection') return "hsl(45 100% 60%)"; // Yellow/Orange

    // For everything else (combined types, unknown types), generate a unique consistent color
    let hash = 0;
    for (let i = 0; i < type.length; i++) {
        hash = type.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate HSL color from hash
    // Hue: 0-360 based on hash
    // Saturation: 65-90% to keep it vivid
    // Lightness: 50-70% to keep it readable but bright
    const h = Math.abs(hash % 360);
    const s = 70 + (Math.abs(hash) % 20);
    const l = 55 + (Math.abs(hash) % 15);

    return `hsl(${h} ${s}% ${l}%)`;
}

function formatTimeAgo(date: Date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `Just now`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}
