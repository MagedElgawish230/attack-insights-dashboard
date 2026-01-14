import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Download, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/sentriai-logo.png";

interface ExecutiveReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: {
        totalThreats: string;
        threatsBlocked: string;
        activeProtection: string;
        falsePositives: string;
    };
}

export const ExecutiveReportModal = ({
    isOpen,
    onClose,
    stats,
}: ExecutiveReportModalProps) => {
    const [isDownloading, setIsDownloading] = useState(false);

    // Parse stats for calculations
    const totalThreats = parseInt(stats.totalThreats.replace(/,/g, "")) || 0;
    const activeProtectionValue = parseFloat(stats.activeProtection) || 0;

    // Calculate security grade
    const getSecurityGrade = () => {
        if (activeProtectionValue >= 95) return { grade: "A+", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30" };
        if (activeProtectionValue >= 80) return { grade: "B", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30" };
        return { grade: "C", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" };
    };

    const securityGrade = getSecurityGrade();

    // Calculate estimated cost savings ($1,500 per threat mitigated)
    const costSavings = totalThreats * 1500;
    const formattedSavings = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(costSavings);

    // Format current date
    const currentDate = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });

    const handleDownloadPDF = async () => {
        setIsDownloading(true);

        // Generate PDF content
        const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SentriAI Executive Summary - ${currentDate}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            padding: 40px; 
            color: #1e293b;
            line-height: 1.6;
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start;
            border-bottom: 2px solid #e2e8f0; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .logo-section h1 { font-size: 24px; color: #0f172a; }
          .logo-section p { color: #64748b; font-size: 14px; }
          .date { color: #64748b; font-size: 14px; }
          .scorecard { 
            display: flex; 
            justify-content: center; 
            gap: 60px; 
            margin: 30px 0; 
            padding: 30px;
            background: #f8fafc;
            border-radius: 12px;
          }
          .score-item { text-align: center; }
          .score-label { font-size: 12px; color: #64748b; margin-bottom: 8px; text-transform: uppercase; }
          .grade { 
            font-size: 48px; 
            font-weight: bold; 
            color: ${activeProtectionValue >= 95 ? '#22c55e' : activeProtectionValue >= 80 ? '#eab308' : '#ef4444'}; 
            background: ${activeProtectionValue >= 95 ? '#f0fdf4' : activeProtectionValue >= 80 ? '#fefce8' : '#fef2f2'};
            padding: 15px 25px;
            border-radius: 12px;
            border: 2px solid ${activeProtectionValue >= 95 ? '#22c55e' : activeProtectionValue >= 80 ? '#eab308' : '#ef4444'};
          }
          .status { 
            color: #22c55e; 
            font-weight: 600;
            background: #f0fdf4;
            padding: 12px 20px;
            border-radius: 8px;
            border: 1px solid #bbf7d0;
          }
          .section { margin: 30px 0; }
          .section h2 { font-size: 18px; color: #0f172a; margin-bottom: 15px; }
          .metrics { display: flex; gap: 20px; }
          .metric { 
            flex: 1; 
            padding: 20px; 
            border-radius: 10px; 
            background: #f8fafc;
            border: 1px solid #e2e8f0;
          }
          .metric.savings { 
            background: #f0fdf4; 
            border-color: #bbf7d0;
          }
          .metric-label { font-size: 12px; color: #64748b; margin-bottom: 5px; }
          .metric-value { font-size: 28px; font-weight: bold; color: #0f172a; }
          .metric.savings .metric-value { color: #22c55e; }
          .metric-note { font-size: 11px; color: #94a3b8; margin-top: 5px; }
          .summary { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 10px;
            border-left: 4px solid #3b82f6;
          }
          .summary p { color: #475569; }
          .summary strong { color: #0f172a; }
          .footer { 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #e2e8f0; 
            text-align: center;
            color: #94a3b8;
            font-size: 12px;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-section">
            <h1>🛡️ SentriAI Executive Summary</h1>
            <p>Finova Bank Core Systems</p>
          </div>
          <div class="date">Report Date: ${currentDate}</div>
        </div>

        <div class="scorecard">
          <div class="score-item">
            <div class="score-label">Security Grade</div>
            <div class="grade">${securityGrade.grade}</div>
          </div>
          <div class="score-item">
            <div class="score-label">System Status</div>
            <div class="status">✓ Operational & Secure</div>
          </div>
        </div>

        <div class="section">
          <h2>📊 Business Impact</h2>
          <div class="metrics">
            <div class="metric">
              <div class="metric-label">Threats Mitigated</div>
              <div class="metric-value">${totalThreats.toLocaleString()}</div>
            </div>
            <div class="metric savings">
              <div class="metric-label">Estimated Cost Savings</div>
              <div class="metric-value">${formattedSavings}</div>
              <div class="metric-note">Based on avg. $1,500/breach cost</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>📝 Executive Summary</h2>
          <div class="summary">
            <p>The SentriAI Defense System has successfully repelled <strong>${totalThreats.toLocaleString()}</strong> cyber-attacks targeting financial infrastructure. Zero data exfiltration incidents recorded. Compliance integrity remains intact.</p>
          </div>
        </div>

        <div class="footer">
          Generated by SentriAI Security Platform • ${currentDate}
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

        // Open print dialog in new window
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(pdfContent);
            printWindow.document.close();
        }

        // Small delay then close modal
        await new Promise((resolve) => setTimeout(resolve, 500));

        setIsDownloading(false);
        toast.success("Report ready for download", {
            description: "Use 'Save as PDF' in the print dialog to save your report.",
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {/* Header */}
                <DialogHeader className="border-b border-slate-200 dark:border-slate-700 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <img
                            src={logo}
                            alt="SentriAI Logo"
                            className="w-10 h-10 rounded-lg"
                        />
                        <div>
                            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                                SentriAI Executive Summary
                            </DialogTitle>
                            <DialogDescription className="text-slate-600 dark:text-slate-400">
                                Finova Bank Core Systems
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Report Date: <span className="font-medium">{currentDate}</span>
                    </div>
                </DialogHeader>

                {/* Hero Section - Security Scorecard */}
                <div className="py-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-center gap-8">
                        {/* Security Grade */}
                        <div className="text-center">
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                Security Grade
                            </div>
                            <div
                                className={`w-24 h-24 rounded-2xl ${securityGrade.bg} ${securityGrade.border} border-2 flex items-center justify-center`}
                            >
                                <span className={`text-4xl font-bold ${securityGrade.color}`}>
                                    {securityGrade.grade}
                                </span>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="text-center">
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                System Status
                            </div>
                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border-2 border-green-500/30">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                    Operational & Secure
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Impact Section */}
                <div className="py-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Business Impact
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Threats Mitigated */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                                Threats Mitigated
                            </div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">
                                {totalThreats.toLocaleString()}
                            </div>
                        </div>

                        {/* Estimated Cost Savings */}
                        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <div className="text-sm text-green-600 dark:text-green-400 mb-1">
                                Estimated Cost Savings
                            </div>
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {formattedSavings}
                            </div>
                            <div className="text-xs text-green-500 dark:text-green-500 mt-1">
                                Based on avg. $1,500/breach cost
                            </div>
                        </div>
                    </div>
                </div>

                {/* Executive Summary Text */}
                <div className="py-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        Executive Summary
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        The SentriAI Defense System has successfully repelled{" "}
                        <strong className="text-slate-900 dark:text-white">
                            {totalThreats.toLocaleString()}
                        </strong>{" "}
                        cyber-attacks targeting financial infrastructure. Zero data
                        exfiltration incidents recorded. Compliance integrity remains
                        intact.
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="bg-primary hover:bg-primary/90"
                    >
                        {isDownloading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
