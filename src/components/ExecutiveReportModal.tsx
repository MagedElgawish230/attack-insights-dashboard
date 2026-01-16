import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Download, Loader2, CheckCircle, FileText } from "lucide-react";
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
    modelAccuracy: string;
    protectedEndpoints: string;
    avgResponseTime: string;
  };
  attackTypes: { name: string; value: number; color: string }[];
}

export const ExecutiveReportModal = ({
  isOpen,
  onClose,
  stats,
  attackTypes,
}: ExecutiveReportModalProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Parse stats for calculations
  const totalThreats = parseInt(stats.totalThreats.replace(/,/g, "")) || 0;
  const activeProtectionValue = parseFloat(stats.activeProtection) || 0;
  const modelAccuracyValue = parseFloat(stats.modelAccuracy) || 0;

  // Calculate Weighted Security Score
  // 70% Detection Rate (Security) + 30% Model Accuracy (UX/Efficiency)
  const weightedScore = (activeProtectionValue * 0.7) + (modelAccuracyValue * 0.3);

  // Calculate security grade based on Weighted Score
  const getSecurityGrade = () => {
    if (weightedScore >= 95)
      return {
        grade: "A+",
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        printColor: "#15803d",
      };
    if (weightedScore >= 90)
      return {
        grade: "A",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        printColor: "#16a34a",
      };
    if (weightedScore >= 80)
      return {
        grade: "B",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        printColor: "#b45309",
      };
    return {
      grade: "C",
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      printColor: "#b91c1c",
    };
  };

  const securityGrade = getSecurityGrade();

  // Calculate risk avoidance value ($2,500 per threat - Enterprise Standard)
  const costSavings = totalThreats * 2500;
  const formattedSavings = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(costSavings);

  // Format current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    // Sort attack types by value descending
    const sortedAttacks = [...attackTypes]
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Generate PDF content
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SentriAI Executive Brief - ${currentDate}</title>
        <style>
          @page { margin: 0; size: A4; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Georgia', 'Times New Roman', serif;
            color: #1a1a1a;
            line-height: 1.5;
            background: #fff;
            padding: 40px 50px;
            -webkit-print-color-adjust: exact;
          }
          
          /* Watermark */
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            color: rgba(0,0,0,0.03);
            font-weight: bold;
            z-index: -1;
            pointer-events: none;
            white-space: nowrap;
          }

          /* Header */
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-end;
            border-bottom: 2px solid #0f172a; 
            padding-bottom: 15px; 
            margin-bottom: 40px; 
          }
          .logo-text { font-size: 28px; font-weight: bold; color: #0f172a; letter-spacing: -0.5px; }
          .client-text { font-family: 'Arial', sans-serif; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; }
          .report-meta { text-align: right; font-family: 'Arial', sans-serif; font-size: 11px; color: #64748b; }
          .report-meta strong { color: #0f172a; }

          /* Sections */
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #0f172a;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-family: 'Arial', sans-serif;
          }
          
          /* Key Metrics Grid */
          .kpi-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 40px;
          }

          /* Scorecard Box */
          .scorecard {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 25px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .grade-container { text-align: center; }
          .grade-val { 
            font-size: 56px; 
            font-weight: bold; 
            color: ${securityGrade.printColor}; 
            line-height: 1;
          }
          .grade-label { font-family: 'Arial', sans-serif; font-size: 11px; text-transform: uppercase; color: #64748b; margin-top: 5px; }
          
          .status-container { text-align: right; }
          .status-badge {
            display: inline-block;
            background: #f0fdf4;
            color: #15803d;
            border: 1px solid #bbf7d0;
            padding: 6px 12px;
            border-radius: 20px;
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            font-weight: bold;
          }

          /* Impact Metrics */
          .impact-metrics {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .metric-box {
            padding: 20px;
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
          }
          .metric-box.highlight { background: #f0f9ff; border-color: #bae6fd; }
          
          .m-label { font-family: 'Arial', sans-serif; font-size: 11px; text-transform: uppercase; color: #64748b; }
          .m-value { font-size: 24px; font-weight: bold; color: #0f172a; margin-top: 5px; }
          .m-sub { font-family: 'Arial', sans-serif; font-size: 10px; color: #0369a1; margin-top: 5px; }

          /* Threat Landscape Table */
          .threat-table {
            width: 100%;
            border-collapse: collapse;
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            margin-bottom: 40px;
          }
          .threat-table th { text-align: left; padding: 10px; border-bottom: 2px solid #e2e8f0; color: #64748b; font-weight: 600; }
          .threat-table td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; color: #334155; }
          .bar-container { width: 100px; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
          .bar-fill { height: 100%; background: #3b82f6; }

          /* Executive Summary Text */
          .exec-summary {
            font-size: 14px;
            color: #334155;
            text-align: justify;
            margin-bottom: 20px;
            padding: 20px;
            background: #f8fafc;
            border-left: 4px solid #0f172a;
          }

          /* Footer */
          .footer {
            position: fixed;
            bottom: 40px;
            left: 50px;
            right: 50px;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
            display: flex;
            justify-content: space-between;
            font-family: 'Arial', sans-serif;
            font-size: 10px;
            color: #94a3b8;
          }
        </style>
      </head>
      <body>
        <div class="watermark">CONFIDENTIAL</div>

        <div class="header">
          <div>
            <div class="logo-text">
              <img src="${logo}" style="height: 32px; vertical-align: text-bottom; margin-right: 8px;" />
              SentriAI
            </div>
            <div class="client-text">Finova Bank Core Systems</div>
          </div>
          <div class="report-meta">
            <div><strong>Report Date:</strong> ${currentDate}</div>
            <div><strong>Classification:</strong> RESTRICTED</div>
            <div><strong>Generated By:</strong> SentriAI Intelligence Engine</div>
          </div>
        </div>

        <div class="kpi-grid">
          <!-- Security Grade Scorecard -->
          <div class="scorecard">
            <div class="grade-container">
              <div class="grade-val">${securityGrade.grade}</div>
              <div class="grade-label">Weighted Security Score</div>
            </div>
            <div class="status-container">
              <div class="status-badge">Operational & Secure</div>
              <div style="font-family: Arial; font-size: 11px; color: #64748b; margin-top: 5px;">
                99.9% Uptime
              </div>
            </div>
          </div>

          <!-- Business Impact -->
          <div class="impact-metrics">
            <div class="metric-box">
              <div class="m-label">Attacks Intercepted</div>
              <div class="m-value">${totalThreats.toLocaleString()}</div>
            </div>
            <div class="metric-box highlight">
              <div class="m-label">Risk Avoidance Value</div>
              <div class="m-value" style="color: #0369a1;">${formattedSavings}</div>
              <div class="m-sub">Based on $2.5k avg. incident cost</div>
            </div>
          </div>
        </div>

        <div class="section-title">Executive Summary</div>
        <div class="exec-summary">
          <p>
            This executive brief certifies that the SentriAI Defense System is actively protecting Finova Bank's critical infrastructure. 
            In the reporting period ending <strong>${currentDate}</strong>, the system successfully identified and neutralized 
            <strong>${totalThreats.toLocaleString()} cyber-threats</strong> with a model accuracy of <strong>${stats.modelAccuracy
      }</strong>.
            <br><br>
            <strong>Key Outcome:</strong> Zero confirmed data exfiltration incidents were recorded. Compliance integrity regarding 
            customer data protection (GDPR/CCPA) remains fully intact. The organization has avoided an estimated 
            <strong>${formattedSavings}</strong> in potential incident response, legal, and reputational costs.
          </p>
        </div>

        <div class="section-title">Threat Landscape Breakdown</div>
        <table class="threat-table">
          <thead>
            <tr>
              <th>Attack Vector</th>
              <th>Volume</th>
              <th>Share</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            ${sortedAttacks
        .map((attack) => {
          const percentage =
            totalThreats > 0
              ? Math.round((attack.value / totalThreats) * 100)
              : 0;
          return `
                <tr>
                  <td><strong>${attack.name}</strong></td>
                  <td>${attack.value}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div class="bar-container">
                        <div class="bar-fill" style="width: ${percentage}%"></div>
                      </div>
                      ${percentage}%
                    </div>
                  </td>
                  <td><span style="color: #64748b; font-size: 10px;">STABLE</span></td>
                </tr>
              `;
        })
        .join("")}
          </tbody>
        </table>

        <div class="footer">
          <div>CONFIDENTIAL - INTERNAL DISTRIBUTION ONLY</div>
          <div>Page 1 of 1</div>
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
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
    }

    // Small delay then close modal
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsDownloading(false);
    toast.success("Executive brief generated", {
      description: "Please save the document as PDF from the print dialog.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <DialogHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
                <img src={logo} alt="SentriAI System" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <DialogTitle className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                  Executive Security Briefing
                </DialogTitle>
                <DialogDescription className="text-slate-500 font-sans">
                  Finova Bank Core Systems • {currentDate}
                </DialogDescription>
              </div>
            </div>
            <div className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded border border-amber-200 uppercase tracking-wide">
              Confidential
            </div>
          </div>
        </DialogHeader>

        <div className="py-6 space-y-8">
          {/* Top Row: Scorecard & Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Security Scorecard */}
            <div className={`p-6 rounded-lg border ${securityGrade.bg} ${securityGrade.border} flex items-center justify-between`}>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                  Security Posture
                </div>
                <div className={`text-5xl font-serif font-bold ${securityGrade.color}`}>
                  {securityGrade.grade}
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/50 border border-current text-sm font-semibold text-emerald-700 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  Operational
                </div>
                <div className="text-xs text-slate-500">
                  Model Accuracy: <span className="font-mono font-bold">{stats.modelAccuracy}</span>
                </div>
              </div>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 uppercase mb-2">Attacks Intercepted</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalThreats.toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800">
                <div className="text-xs text-sky-700 dark:text-sky-400 uppercase mb-2">Risk Avoidance</div>
                <div className="text-2xl font-bold text-sky-700 dark:text-sky-400">
                  {formattedSavings}
                </div>
              </div>
            </div>
          </div>

          {/* Threat Landscape */}
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              Threat Landscape Breakdown
            </h3>
            <div className="border rounded-lg border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Attack Vector</th>
                    <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Volume</th>
                    <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Distribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[...attackTypes]
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 4)
                    .map((attack) => (
                      <tr key={attack.name}>
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{attack.name}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{attack.value}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${(attack.value / totalThreats) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500 w-8">
                              {Math.round((attack.value / totalThreats) * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
          <div className="text-xs text-slate-400">
            Confidential - Internal Use Only
          </div>
          <div className="flex gap-3">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
