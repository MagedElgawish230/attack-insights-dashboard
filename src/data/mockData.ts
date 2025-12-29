
export interface WebsiteData {
    id: string;
    name: string;
    url: string;
    stats: {
        totalThreats: string;
        threatsBlocked: string;
        activeProtection: string;
        falsePositives: string;
        avgResponseTime: string;
        protectedEndpoints: string;
        modelAccuracy: string;
        trend: number;
        blockedTrend: number;
    };
    attackTrend: Array<{ time: string; attacks: number; blocked: number }>;
    attackTypes: Array<{ name: string; value: number; color: string }>;
    recentAttacks: Array<{
        id: number;
        type: string;
        severity: string;
        ip: string;
        time: string;
        status: string;
        payload: string;
    }>;
}

export const websites: WebsiteData[] = [
    {
        id: "ecommerce",
        name: "E-Commerce Store",
        url: "https://shop.example.com",
        stats: {
            totalThreats: "1,247",
            threatsBlocked: "1,189",
            activeProtection: "99.2%",
            falsePositives: "58",
            avgResponseTime: "0.8ms",
            protectedEndpoints: "247",
            modelAccuracy: "98.7%",
            trend: 12,
            blockedTrend: 8
        },
        attackTrend: [
            { time: "00:00", attacks: 12, blocked: 11 },
            { time: "04:00", attacks: 8, blocked: 8 },
            { time: "08:00", attacks: 24, blocked: 22 },
            { time: "12:00", attacks: 45, blocked: 42 },
            { time: "16:00", attacks: 38, blocked: 35 },
            { time: "20:00", attacks: 52, blocked: 48 },
            { time: "23:59", attacks: 31, blocked: 29 },
        ],
        attackTypes: [
            { name: "SQL Injection", value: 438, color: "hsl(350 89% 60%)" },
            { name: "XSS", value: 512, color: "hsl(38 92% 50%)" },
            { name: "Command Injection", value: 297, color: "hsl(45 100% 60%)" },
        ],
        recentAttacks: [
            {
                id: 1,
                type: "SQL Injection",
                severity: "critical",
                ip: "192.168.1.45",
                time: "2 mins ago",
                status: "blocked",
                payload: "' OR '1'='1' --",
            },
            {
                id: 2,
                type: "XSS Attack",
                severity: "critical",
                ip: "10.0.0.123",
                time: "3 mins ago",
                status: "blocked",
                payload: "<script>alert('XSS')</script>",
            },
        ]
    },
    {
        id: "corporate",
        name: "Corporate Portal",
        url: "https://portal.enterprise.co",
        stats: {
            totalThreats: "856",
            threatsBlocked: "850",
            activeProtection: "99.8%",
            falsePositives: "12",
            avgResponseTime: "0.5ms",
            protectedEndpoints: "120",
            modelAccuracy: "99.1%",
            trend: -5,
            blockedTrend: 2
        },
        attackTrend: [
            { time: "00:00", attacks: 5, blocked: 5 },
            { time: "04:00", attacks: 2, blocked: 2 },
            { time: "08:00", attacks: 15, blocked: 15 },
            { time: "12:00", attacks: 28, blocked: 28 },
            { time: "16:00", attacks: 20, blocked: 19 },
            { time: "20:00", attacks: 35, blocked: 34 },
            { time: "23:59", attacks: 10, blocked: 10 },
        ],
        attackTypes: [
            { name: "SQL Injection", value: 120, color: "hsl(350 89% 60%)" },
            { name: "XSS", value: 80, color: "hsl(38 92% 50%)" },
            { name: "Command Injection", value: 50, color: "hsl(45 100% 60%)" },
        ],
        recentAttacks: [
            {
                id: 101,
                type: "Command Injection",
                severity: "medium",
                ip: "192.168.99.1",
                time: "1 hour ago",
                status: "blocked",
                payload: "ping -c 1 127.0.0.1",
            }
        ]
    },
    {
        id: "blog",
        name: "Blog Network",
        url: "https://blog.media.net",
        stats: {
            totalThreats: "2,340",
            threatsBlocked: "2,100",
            activeProtection: "98.5%",
            falsePositives: "89",
            avgResponseTime: "1.2ms",
            protectedEndpoints: "550",
            modelAccuracy: "97.5%",
            trend: 25,
            blockedTrend: 15
        },
        attackTrend: [
            { time: "00:00", attacks: 40, blocked: 35 },
            { time: "04:00", attacks: 30, blocked: 25 },
            { time: "08:00", attacks: 80, blocked: 70 },
            { time: "12:00", attacks: 150, blocked: 140 },
            { time: "16:00", attacks: 120, blocked: 110 },
            { time: "20:00", attacks: 180, blocked: 160 },
            { time: "23:59", attacks: 90, blocked: 80 },
        ],
        attackTypes: [
            { name: "SQL Injection", value: 800, color: "hsl(350 89% 60%)" },
            { name: "XSS", value: 1200, color: "hsl(38 92% 50%)" },
            { name: "Command Injection", value: 150, color: "hsl(45 100% 60%)" },
        ],
        recentAttacks: [
            {
                id: 201,
                type: "XSS Attack",
                severity: "low",
                ip: "10.10.10.10",
                time: "10 mins ago",
                status: "blocked",
                payload: "<img src=x>",
            }
        ]
    }
];
