// Cross-platform PDF generation via expo-print.
// On web: opens the PDF in a new tab (browser downloads it).
// On native: saves to a file and opens the share sheet so the user can save/email/print.
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

export type LetterFields = {
  signatureId: string;
  fullName: string;
  community: string;         // e.g. "Santa Monica-Malibu, CA"
  connection: string;
  interest: string;
  comment: string;
  date: string;              // human-readable
};

export type CertificateFields = {
  certificateId: string;
  fullName: string;
  community: string;
  tier: number;             // e.g. 10000
  fund: string;             // "AI Lab Research" | "AI High Schools"
  date: string;
  crestInitials: string;    // "SM" / "PA" / "P8"
  crestColor: string;
};

function fmtMoney(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

function letterHTML(f: LetterFields) {
  return `<!doctype html><html><head><meta charset="utf-8" />
  <style>
    @page { size: Letter; margin: 0.9in; }
    body { font-family: Georgia, "Times New Roman", serif; color: #1b1f2a; }
    .header { text-align: center; border-bottom: 2px solid #10162c; padding-bottom: 10px; margin-bottom: 20px; }
    .header h1 { color: #10162c; letter-spacing: 3px; margin: 0; font-size: 22px; }
    .header .tag { color: #6f7896; font-size: 11px; letter-spacing: 2px; margin-top: 4px; }
    .meta { font-size: 11px; color: #6f7896; margin: 24px 0 6px; }
    .to { margin-bottom: 20px; }
    .body p { line-height: 1.55; margin: 0 0 12px; font-size: 13px; }
    .quote { border-left: 3px solid #34e08a; padding: 6px 12px; background: #f4f1e8; font-style: italic; color: #3b4152; margin: 14px 0; font-size: 12px; }
    .disc { font-size: 10.5px; color: #6f7896; margin-top: 22px; padding: 10px; background: #f4f1e8; border-left: 3px solid #f2a93c; }
    .sig { margin-top: 30px; }
    .sig .name { border-bottom: 1px solid #1b1f2a; padding-bottom: 2px; font-family: "Segoe Script", "Snell Roundhand", cursive; font-size: 20px; }
    .sig .caption { font-size: 10px; color: #6f7896; margin-top: 4px; }
    .footer { margin-top: 30px; font-size: 9px; color: #6f7896; letter-spacing: 1.5px; text-align: center; border-top: 1px solid #ddd; padding-top: 10px; }
  </style></head><body>
    <div class="header">
      <h1>DIGITAL-UNI</h1>
      <div class="tag">UNIVERSITY OF THE FUTURE · JOBS OF TOMORROW</div>
    </div>
    <div class="meta">${escapeHtml(f.date)} · Ref: ${escapeHtml(f.signatureId)}</div>
    <div class="to">
      <strong>To:</strong> ${escapeHtml(f.community)} City Council Office &amp; Staff<br/>
      <strong>Re:</strong> Community Declaration of Support — Digital-UNI AI High School Initiative
    </div>
    <div class="body">
      <p>To the members of the ${escapeHtml(f.community)} City Council,</p>
      <p>I, <strong>${escapeHtml(f.fullName)}</strong>, hereby declare my support for the proposed Digital-UNI AI High School and community initiative in ${escapeHtml(f.community)}. I am submitting this declaration as a <em>${escapeHtml(f.connection)}</em>, with a primary area of interest in <em>${escapeHtml(f.interest)}</em>.</p>
      ${f.comment ? `<div class="quote">${escapeHtml(f.comment)}</div>` : ""}
      <p>I attest that the information above is accurate and that my typed signature below constitutes my own personal signature for the purposes of this community registration.</p>
    </div>
    <div class="disc">
      This declaration of support reflects Digital-UNI's community-building campaign only. It is submitted independently of, and is not to be construed as, an endorsement or vote related to any candidacy, including the founder's candidacy for Santa Monica College Board.
    </div>
    <div class="sig">
      <div class="name">${escapeHtml(f.fullName)}</div>
      <div class="caption">Electronic signature · ${escapeHtml(f.date)}</div>
    </div>
    <div class="footer">DIGITAL-UNI · LEARN · CERTIFY · BUILD · BELONG · ${escapeHtml(f.signatureId)}</div>
  </body></html>`;
}

function certificateHTML(f: CertificateFields) {
  return `<!doctype html><html><head><meta charset="utf-8" />
  <style>
    @page { size: Letter landscape; margin: 0.6in; }
    body { font-family: Georgia, serif; color: #1b1f2a; background: #f4f1e8; margin: 0; }
    .frame { border: 8px double #10162c; padding: 36px 48px; min-height: 6.4in; position: relative; }
    .band { position: absolute; top: 0; left: 0; right: 0; height: 24px; background: linear-gradient(90deg, #34e08a, #1fae8f); }
    .header { text-align: center; margin-top: 22px; }
    .header h1 { color: #10162c; letter-spacing: 5px; margin: 0; font-size: 30px; }
    .header .tag { color: #6f7896; font-size: 11px; letter-spacing: 3px; margin-top: 4px; }
    .crest { width: 90px; height: 100px; margin: 26px auto 8px; background: ${f.crestColor}; clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%); display: flex; align-items: center; justify-content: center; color: #10162c; font-weight: 800; font-size: 28px; letter-spacing: 2px; }
    .kicker { text-align: center; color: #f2a93c; letter-spacing: 4px; font-size: 12px; font-weight: 700; margin: 12px 0 4px; }
    .title { text-align: center; font-size: 28px; font-weight: 700; letter-spacing: 2px; color: #10162c; margin: 0 0 18px; }
    .presented { text-align: center; font-style: italic; color: #3b4152; margin: 6px 0 4px; }
    .name { text-align: center; font-family: "Segoe Script", "Snell Roundhand", cursive; font-size: 44px; color: #10162c; margin: 2px 0 12px; border-bottom: 1px solid #10162c; padding-bottom: 6px; display: inline-block; min-width: 5in; }
    .center { text-align: center; }
    .tier { text-align: center; font-size: 22px; color: #34e08a; font-weight: 700; margin-top: 4px; letter-spacing: 1px; }
    .fund { text-align: center; color: #3b4152; letter-spacing: 2px; margin-top: 4px; }
    .row { display: flex; justify-content: space-between; margin-top: 32px; align-items: flex-end; }
    .sig-block { text-align: center; flex: 1; }
    .sig-line { border-top: 1px solid #10162c; padding-top: 4px; font-size: 11px; color: #3b4152; margin: 0 20px; }
    .id { text-align: center; font-family: monospace; font-size: 10px; color: #6f7896; margin-top: 20px; letter-spacing: 1.5px; }
    .disc { font-size: 9.5px; color: #6f7896; margin-top: 12px; padding: 8px 14px; border-top: 1px dashed #6f7896; text-align: center; line-height: 1.4; }
  </style></head><body>
    <div class="frame">
      <div class="band"></div>
      <div class="header">
        <h1>DIGITAL-UNI</h1>
        <div class="tag">UNIVERSITY OF THE FUTURE · JOBS OF TOMORROW</div>
      </div>
      <div class="crest">${escapeHtml(f.crestInitials)}</div>
      <div class="kicker">COMMUNITY IMPACT CERTIFICATE</div>
      <div class="title">Pledge of Support</div>
      <div class="presented">is proudly presented to</div>
      <div class="center"><div class="name">${escapeHtml(f.fullName)}</div></div>
      <div class="tier">${fmtMoney(f.tier)}</div>
      <div class="fund">${escapeHtml(f.fund)} · ${escapeHtml(f.community)}</div>
      <div class="row">
        <div class="sig-block"><div class="sig-line">Brahim Boumakh · Founder, Digital-UNI</div></div>
        <div class="sig-block"><div class="sig-line">${escapeHtml(f.date)}</div></div>
      </div>
      <div class="id">Certificate ID: ${escapeHtml(f.certificateId)}</div>
      <div class="disc">
        This certificate acknowledges a community pledge of support and is not currently tax-deductible.
        This declaration of support reflects Digital-UNI's community-building campaign only. It is submitted independently of, and is not to be construed as, an endorsement or vote related to any candidacy, including the founder's candidacy for Santa Monica College Board.
      </div>
    </div>
  </body></html>`;
}

function escapeHtml(s: string) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function exportPdf(html: string, name: string) {
  // On web: printAsync opens a system print dialog which is fine; but if we
  // just want a downloadable PDF, using html + JsPDF-style would need extra
  // libs. printAsync from expo-print on web calls window.print() with the
  // rendered HTML — the user can Save as PDF from there. On native, we get a
  // real PDF file URI and can share it.
  if (Platform.OS === "web") {
    // Open the HTML in a new window and trigger print. The user can then save
    // it as a PDF via the print dialog's "Save as PDF" destination.
    const w = window.open("", "_blank", "width=800,height=1000");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    setTimeout(() => {
      try { w.focus(); w.print(); } catch {}
    }, 400);
    return;
  }
  const { uri } = await Print.printToFileAsync({ html });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      UTI: "com.adobe.pdf",
      mimeType: "application/pdf",
      dialogTitle: name,
    });
  }
}

export async function downloadSupportLetter(f: LetterFields) {
  return exportPdf(letterHTML(f), `${f.signatureId}.pdf`);
}

export async function downloadCertificate(f: CertificateFields) {
  return exportPdf(certificateHTML(f), `${f.certificateId}.pdf`);
}

// Static "current community letter template" — placeholder content matching
// the Digital-UNI formal-notice style, used by the Home screen "City Council
// Letter · PDF" button before a signer fills the form.
export async function downloadCouncilLetterTemplate() {
  return exportPdf(letterHTML({
    signatureId: "DU-SIG-TEMPLATE",
    fullName: "[Your Name]",
    community: "[Your Community]",
    connection: "[Parent / Educator / Neighborhood leader / …]",
    interest: "[General community support / Education & AI High School / …]",
    comment: "[Your reason for support]",
    date: new Date().toLocaleDateString(),
  }), "Digital-UNI_City_Council_Letter_Template.pdf");
}
