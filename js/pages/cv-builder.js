import { esc, icon } from "../utils.js";

const fields = [
  ["fullName", "Full name", "text", "Your full name"],
  ["email", "Email", "email", "name@email.com"],
  ["location", "Location", "text", "City, Country"],
  ["linkedin", "LinkedIn", "url", "linkedin.com/in/username"],
  ["portfolio", "Portfolio / Website", "url", "yourwebsite.com"],
];

// Country calling codes. The list includes sovereign states and commonly used territories.
const countries = [
  ["Afghanistan", "+93"],
  ["Albania", "+355"],
  ["Algeria", "+213"],
  ["American Samoa", "+1 684"],
  ["Andorra", "+376"],
  ["Angola", "+244"],
  ["Anguilla", "+1 264"],
  ["Antigua and Barbuda", "+1 268"],
  ["Argentina", "+54"],
  ["Armenia", "+374"],
  ["Aruba", "+297"],
  ["Australia", "+61"],
  ["Austria", "+43"],
  ["Azerbaijan", "+994"],
  ["Bahamas", "+1 242"],
  ["Bahrain", "+973"],
  ["Bangladesh", "+880"],
  ["Barbados", "+1 246"],
  ["Belarus", "+375"],
  ["Belgium", "+32"],
  ["Belize", "+501"],
  ["Benin", "+229"],
  ["Bermuda", "+1 441"],
  ["Bhutan", "+975"],
  ["Bolivia", "+591"],
  ["Bosnia and Herzegovina", "+387"],
  ["Botswana", "+267"],
  ["Brazil", "+55"],
  ["British Virgin Islands", "+1 284"],
  ["Brunei", "+673"],
  ["Bulgaria", "+359"],
  ["Burkina Faso", "+226"],
  ["Burundi", "+257"],
  ["Cambodia", "+855"],
  ["Cameroon", "+237"],
  ["Canada", "+1"],
  ["Cape Verde", "+238"],
  ["Cayman Islands", "+1 345"],
  ["Central African Republic", "+236"],
  ["Chad", "+235"],
  ["Chile", "+56"],
  ["China", "+86"],
  ["Colombia", "+57"],
  ["Comoros", "+269"],
  ["Congo", "+242"],
  ["Cook Islands", "+682"],
  ["Costa Rica", "+506"],
  ["Croatia", "+385"],
  ["Cuba", "+53"],
  ["Curacao", "+599"],
  ["Cyprus", "+357"],
  ["Czechia", "+420"],
  ["Democratic Republic of the Congo", "+243"],
  ["Denmark", "+45"],
  ["Djibouti", "+253"],
  ["Dominica", "+1 767"],
  ["Dominican Republic", "+1 809"],
  ["Ecuador", "+593"],
  ["Egypt", "+20"],
  ["El Salvador", "+503"],
  ["Equatorial Guinea", "+240"],
  ["Eritrea", "+291"],
  ["Estonia", "+372"],
  ["Eswatini", "+268"],
  ["Ethiopia", "+251"],
  ["Falkland Islands", "+500"],
  ["Faroe Islands", "+298"],
  ["Fiji", "+679"],
  ["Finland", "+358"],
  ["France", "+33"],
  ["French Guiana", "+594"],
  ["French Polynesia", "+689"],
  ["Gabon", "+241"],
  ["Gambia", "+220"],
  ["Georgia", "+995"],
  ["Germany", "+49"],
  ["Ghana", "+233"],
  ["Gibraltar", "+350"],
  ["Greece", "+30"],
  ["Greenland", "+299"],
  ["Grenada", "+1 473"],
  ["Guadeloupe", "+590"],
  ["Guam", "+1 671"],
  ["Guatemala", "+502"],
  ["Guernsey", "+44 1481"],
  ["Guinea", "+224"],
  ["Guinea-Bissau", "+245"],
  ["Guyana", "+592"],
  ["Haiti", "+509"],
  ["Honduras", "+504"],
  ["Hong Kong", "+852"],
  ["Hungary", "+36"],
  ["Iceland", "+354"],
  ["India", "+91"],
  ["Indonesia", "+62"],
  ["Iran", "+98"],
  ["Iraq", "+964"],
  ["Ireland", "+353"],
  ["Isle of Man", "+44 1624"],
  ["Israel", "+972"],
  ["Italy", "+39"],
  ["Ivory Coast", "+225"],
  ["Jamaica", "+1 876"],
  ["Japan", "+81"],
  ["Jersey", "+44 1534"],
  ["Jordan", "+962"],
  ["Kazakhstan", "+7"],
  ["Kenya", "+254"],
  ["Kiribati", "+686"],
  ["Kosovo", "+383"],
  ["Kuwait", "+965"],
  ["Kyrgyzstan", "+996"],
  ["Laos", "+856"],
  ["Latvia", "+371"],
  ["Lebanon", "+961"],
  ["Lesotho", "+266"],
  ["Liberia", "+231"],
  ["Libya", "+218"],
  ["Liechtenstein", "+423"],
  ["Lithuania", "+370"],
  ["Luxembourg", "+352"],
  ["Macau", "+853"],
  ["Madagascar", "+261"],
  ["Malawi", "+265"],
  ["Malaysia", "+60"],
  ["Maldives", "+960"],
  ["Mali", "+223"],
  ["Malta", "+356"],
  ["Marshall Islands", "+692"],
  ["Martinique", "+596"],
  ["Mauritania", "+222"],
  ["Mauritius", "+230"],
  ["Mayotte", "+262"],
  ["Mexico", "+52"],
  ["Micronesia", "+691"],
  ["Moldova", "+373"],
  ["Monaco", "+377"],
  ["Mongolia", "+976"],
  ["Montenegro", "+382"],
  ["Montserrat", "+1 664"],
  ["Morocco", "+212"],
  ["Mozambique", "+258"],
  ["Myanmar", "+95"],
  ["Namibia", "+264"],
  ["Nauru", "+674"],
  ["Nepal", "+977"],
  ["Netherlands", "+31"],
  ["New Caledonia", "+687"],
  ["New Zealand", "+64"],
  ["Nicaragua", "+505"],
  ["Niger", "+227"],
  ["Nigeria", "+234"],
  ["Niue", "+683"],
  ["North Korea", "+850"],
  ["North Macedonia", "+389"],
  ["Northern Mariana Islands", "+1 670"],
  ["Norway", "+47"],
  ["Oman", "+968"],
  ["Pakistan", "+92"],
  ["Palau", "+680"],
  ["Palestine", "+970"],
  ["Panama", "+507"],
  ["Papua New Guinea", "+675"],
  ["Paraguay", "+595"],
  ["Peru", "+51"],
  ["Philippines", "+63"],
  ["Poland", "+48"],
  ["Portugal", "+351"],
  ["Puerto Rico", "+1 787"],
  ["Qatar", "+974"],
  ["Reunion", "+262"],
  ["Romania", "+40"],
  ["Russia", "+7"],
  ["Rwanda", "+250"],
  ["Saint Kitts and Nevis", "+1 869"],
  ["Saint Lucia", "+1 758"],
  ["Saint Vincent and the Grenadines", "+1 784"],
  ["Samoa", "+685"],
  ["San Marino", "+378"],
  ["Sao Tome and Principe", "+239"],
  ["Saudi Arabia", "+966"],
  ["Senegal", "+221"],
  ["Serbia", "+381"],
  ["Seychelles", "+248"],
  ["Sierra Leone", "+232"],
  ["Singapore", "+65"],
  ["Sint Maarten", "+1 721"],
  ["Slovakia", "+421"],
  ["Slovenia", "+386"],
  ["Solomon Islands", "+677"],
  ["Somalia", "+252"],
  ["South Africa", "+27"],
  ["South Korea", "+82"],
  ["South Sudan", "+211"],
  ["Spain", "+34"],
  ["Sri Lanka", "+94"],
  ["Sudan", "+249"],
  ["Suriname", "+597"],
  ["Sweden", "+46"],
  ["Switzerland", "+41"],
  ["Syria", "+963"],
  ["Taiwan", "+886"],
  ["Tajikistan", "+992"],
  ["Tanzania", "+255"],
  ["Thailand", "+66"],
  ["Timor-Leste", "+670"],
  ["Togo", "+228"],
  ["Tokelau", "+690"],
  ["Tonga", "+676"],
  ["Trinidad and Tobago", "+1 868"],
  ["Tunisia", "+216"],
  ["Turkey", "+90"],
  ["Turkmenistan", "+993"],
  ["Turks and Caicos Islands", "+1 649"],
  ["Tuvalu", "+688"],
  ["Uganda", "+256"],
  ["Ukraine", "+380"],
  ["United Arab Emirates", "+971"],
  ["United Kingdom", "+44"],
  ["United States", "+1"],
  ["Uruguay", "+598"],
  ["Uzbekistan", "+998"],
  ["Vanuatu", "+678"],
  ["Vatican City", "+39 06"],
  ["Venezuela", "+58"],
  ["Vietnam", "+84"],
  ["Wallis and Futuna", "+681"],
  ["Western Sahara", "+212"],
  ["Yemen", "+967"],
  ["Zambia", "+260"],
  ["Zimbabwe", "+263"],
];

const richFields = [
  {
    key: "experience",
    label: "Experience details",
    title: "Work Experience",
    eyebrow: "03 / EXPERIENCE",
    rows: 7,
    placeholder:
      "Position — Company Name\nJan 2025 – Present\n• Describe your responsibilities and achievements.",
  },
  {
    key: "education",
    label: "Education details",
    title: "Education",
    eyebrow: "04 / EDUCATION",
    rows: 4,
    placeholder:
      "Bachelor's Degree — University Name\n2021 – 2025\n• Relevant coursework or achievement",
  },
  {
    key: "projects",
    label: "Project details",
    title: "Projects",
    eyebrow: "05 / PROJECTS",
    rows: 5,
    placeholder:
      "Project Name — Role | Year\n• Describe the project and measurable result.",
  },
  {
    key: "skills",
    label: "Skills",
    title: "Skills",
    eyebrow: "06 / SKILLS",
    rows: 3,
    placeholder: "• Selenium\n• Java\n• API Testing",
  },
  {
    key: "certifications",
    label: "Certifications",
    title: "Certifications",
    eyebrow: "07 / CERTIFICATIONS",
    rows: 3,
    placeholder: "Certification name — Issuer, Year",
  },
  {
    key: "organization",
    label: "Organization experience",
    title: "Organization Experience",
    eyebrow: "08 / ORGANIZATION",
    rows: 4,
    placeholder:
      "Organization Name — Position\nPeriod\n• Activities, responsibilities, or achievements",
  },
];

function safeRichHTML(html = "") {
  const parser = new DOMParser();
  const doc = parser.parseFromString(String(html), "text/html");
  const allowed = new Set([
    "B",
    "STRONG",
    "I",
    "EM",
    "U",
    "UL",
    "OL",
    "LI",
    "P",
    "BR",
  ]);
  const clean = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (!allowed.has(child.tagName)) {
          clean(child);
          child.replaceWith(...child.childNodes);
        } else {
          [...child.attributes].forEach((attr) =>
            child.removeAttribute(attr.name),
          );
          clean(child);
        }
      } else if (child.nodeType !== Node.TEXT_NODE) child.remove();
    });
  };
  clean(doc.body);
  return doc.body.innerHTML;
}

function plainText(html = "") {
  const doc = new DOMParser().parseFromString(String(html), "text/html");
  return doc.body.textContent || "";
}

function richEditor(field, data) {
  const content = safeRichHTML(data[field.key] || "");
  return `<section class="panel cv-section"><div class="cv-section-heading"><div><span class="eyebrow">${field.eyebrow}</span><h3>${field.title}</h3></div></div><label class="cv-field"><span>${field.label}</span><div class="cv-rich-editor"><div class="cv-rich-toolbar" role="toolbar" aria-label="Formatting ${field.label}"><button type="button" data-rich-command="bold" title="Bold"><b>B</b></button><button type="button" data-rich-command="italic" title="Italic"><i>I</i></button><button type="button" data-rich-command="underline" title="Underline"><u>U</u></button><span></span><button type="button" data-rich-command="insertUnorderedList" title="Bullet list">• List</button><button type="button" data-rich-command="insertOrderedList" title="Numbered list">1. List</button></div><div class="cv-rich-content" contenteditable="true" role="textbox" aria-multiline="true" data-rich-field="${field.key}" data-placeholder="${esc(field.placeholder)}">${content}</div></div><input type="hidden" name="${field.key}" value="${esc(content)}"></label></section>`;
}

export function renderCVBuilder(data = {}) {
  const value = (key) => esc(data[key] || "");
  const input = ([key, label, type, placeholder]) =>
    `<label class="cv-field"><span>${label}</span><input name="${key}" type="${type}" value="${value(key)}" placeholder="${placeholder}"></label>`;
  const oldPhone = data.phone || "";
  const legacyCode =
    !data.phoneCountryCode && oldPhone.startsWith("+")
      ? countries
          .map(([, code]) => code)
          .sort((a, b) => b.length - a.length)
          .find((code) => oldPhone.startsWith(code))
      : "";
  const selectedCode = data.phoneCountryCode || legacyCode || "+62";
  const phoneNumber =
    data.phoneNumber ||
    (oldPhone.startsWith(selectedCode)
      ? oldPhone.slice(selectedCode.length).trim()
      : oldPhone);
  const countryOptions = countries
    .map(
      ([name, code]) =>
        `<option value="${esc(code)}" ${code === selectedCode ? "selected" : ""}>${esc(name)} (${esc(code)})</option>`,
    )
    .join("");
  return `
      <div class="page-heading"><div><span class="eyebrow">CAREER PROFILE</span><h1>CV Builder</h1><p>Buat, edit, dan simpan CV profesional yang ramah ATS.</p></div></div>
      <form id="cv-form" class="cv-builder-layout">
        <div class="cv-editor">
          <section class="panel cv-section"><div class="cv-section-heading"><div><span class="eyebrow">01 / PERSONAL</span><h3>Personal Information</h3></div></div><div class="cv-fields-grid">${input(fields[0])}${input(fields[1])}<label class="cv-field"><span>Phone number</span><div class="cv-phone-input"><select name="phoneCountryCode" aria-label="Country calling code">${countryOptions}</select><input name="phoneNumber" type="tel" inputmode="tel" value="${esc(phoneNumber)}" placeholder="812 3456 7890"></div></label>${fields.slice(2).map(input).join("")}</div></section>
          <section class="panel cv-section"><div class="cv-section-heading"><div><span class="eyebrow">02 / PROFILE</span><h3>Professional Summary</h3></div></div><label class="cv-field"><span>Summary</span><textarea name="summary" rows="4" placeholder="Write a concise summary of your background, strengths, and career goals...">${value("summary")}</textarea></label></section>
          ${richFields.map((field) => richEditor(field, data)).join("")}
          <div class="cv-actions"><button class="btn btn-primary" type="submit">${icon("save")} Save CV</button><button class="btn btn-soft" type="button" data-export-cv>${icon("file-down")} Export PDF</button></div>
        </div>
        <aside class="cv-preview-panel"><div class="cv-preview-top"><div><span class="eyebrow">LIVE PREVIEW</span><h3>ATS Resume</h3></div><span class="cv-ats-tag">ATS FRIENDLY</span></div><div id="cv-live-preview" class="cv-paper">${renderATSDocument(data)}</div><p class="cv-preview-note">Single-column layout · Selectable text · No graphics or tables</p></aside>
      </form>`;
}

export function collectCVForm(form) {
  const data = {};
  new FormData(form).forEach(
    (value, key) => (data[key] = String(value).trim()),
  );
  form.querySelectorAll("[data-rich-field]").forEach((editor) => {
    const key = editor.dataset.richField;
    data[key] = safeRichHTML(editor.innerHTML);
  });
  data.phone = [data.phoneCountryCode || "+62", data.phoneNumber || ""]
    .filter(Boolean)
    .join(" ")
    .trim();
  return data;
}

export function renderATSDocument(data = {}) {
  const val = (key) => esc(data[key] || "");
  const richSection = (title, key) => {
    const html = safeRichHTML(data[key] || "");
    return plainText(html).trim()
      ? `<section><h2>${title}</h2><div class="ats-rich-content">${html}</div></section>`
      : "";
  };
  const summary = data.summary?.trim()
    ? `<section><h2>PROFESSIONAL SUMMARY</h2><div>${esc(data.summary).replace(/\r?\n/g, "<br>")}</div></section>`
    : "";
  const contact = [
    data.email,
    data.phone ||
      [data.phoneCountryCode, data.phoneNumber].filter(Boolean).join(" "),
    data.location,
    data.linkedin,
    data.portfolio,
  ]
    .filter(Boolean)
    .map(esc)
    .join(" | ");
  return `<article class="ats-document"><header><h1>${val("fullName") || "Your Name"}</h1><p>${contact || "Email | Phone | Location | LinkedIn"}</p></header>${summary}${richSection("WORK EXPERIENCE", "experience")}${richSection("EDUCATION", "education")}${richSection("PROJECTS", "projects")}${richSection("SKILLS", "skills")}${richSection("CERTIFICATIONS", "certifications")}${richSection("ORGANIZATION EXPERIENCE", "organization")}</article>`;
}

export function openCVPrint(data) {
  const popup = window.open("", "_blank");
  if (!popup) {
    alert("Please allow pop-ups to export your CV.");
    return;
  }
  popup.document
    .write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(data.fullName || "CV")}</title><style>
      @page{size:A4;margin:18mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:0;font-size:10.5pt;line-height:1.45}.ats-document{width:100%}header{text-align:center;border-bottom:1px solid #333;padding-bottom:12px;margin-bottom:16px}header h1{font-size:20pt;margin:0 0 5px;font-weight:700}header p{font-size:9.5pt;margin:0;overflow-wrap:anywhere}section{margin:0 0 14px;break-inside:avoid}section h2{font-size:11pt;letter-spacing:.4px;border-bottom:1px solid #555;padding-bottom:3px;margin:0 0 6px}.ats-rich-content p{margin:0 0 4px}.ats-rich-content ul,.ats-rich-content ol{margin:3px 0 5px;padding-left:22px}.ats-rich-content li{margin:1px 0}.ats-rich-content strong,.ats-rich-content b{font-weight:700}.ats-rich-content em,.ats-rich-content i{font-style:italic}.ats-rich-content u{text-decoration:underline}@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
      </style></head><body>${renderATSDocument(data)}<script>window.onload=()=>{window.print()}<\/script></body></html>`);
  popup.document.close();
}
