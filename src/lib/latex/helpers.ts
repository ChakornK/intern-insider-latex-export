export const closeRadixPopover = () => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Escape",
      code: "Escape",
      bubbles: true,
      cancelable: true,
    }),
  );
};

export const escLatex = (e: string) =>
  e
    .replaceAll("\\", "\\textbackslash{}")
    .replaceAll("_", "\\_")
    .replaceAll("%", "\\%")
    .replaceAll("$", "\\$")
    .replaceAll("#", "\\#")
    .replaceAll("&", "\\&")
    .replaceAll("{", "\\{")
    .replaceAll("}", "\\}")
    .replaceAll("<", "\\textless{}")
    .replaceAll(">", "\\textgreater{}")
    .replaceAll("^", "\\textasciicircum{}")
    .replaceAll("~", "\\textasciitilde{}");
