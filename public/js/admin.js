function renderAdminRow(entry) {
  const row = document.createElement("tr");

  for (const value of [
    entry.id,
    entry.username,
    entry.role,
    entry.displayName,
    entry.noteCount
  ]) {
    const cell = document.createElement("td");
    cell.textContent = String(value);
    row.appendChild(cell);
  }

  return row;
}

(async function bootstrapAdmin() {
  try {
    const user = await loadCurrentUser();

    if (!user) {
      document.getElementById("admin-warning").textContent = "Please log in first.";
      return;
    }

    if (user.role !== "admin") {
      document.getElementById("admin-warning").textContent = "Admin access required.";
      return;
    }

    document.getElementById("admin-warning").textContent = "Authenticated as admin.";

    const result = await api("/api/admin/users");
    const tableBody = document.getElementById("admin-users");
    tableBody.replaceChildren(...result.users.map(renderAdminRow));
  } catch (error) {
    document.getElementById("admin-warning").textContent = error.message;
  }
})();
