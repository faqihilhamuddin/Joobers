export function exportCSV(apps) {
  const fields = [
    "company",
    "position",
    "location",
    "status",
    "date",
    "url",
    "notes",
  ];
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    fields.join(","),
    ...apps.map((a) => fields.map((f) => q(a[f])).join(",")),
  ].join("\n");
  const url = URL.createObjectURL(
    new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "jobtrack-applications.csv";
  a.click();
  URL.revokeObjectURL(url);
}
