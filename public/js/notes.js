
function renderNote(note) {
  const card = document.createElement("article");

  const title = document.createElement("h3");
  title.textContent = note.title;

  const meta = document.createElement("p");
  meta.textContent = `Owner: ${note.ownerUsername} | ID: ${note.id} | Pinned: ${note.pinned}`;

  const body = document.createElement("p");
  body.textContent = note.body;

  card.appendChild(title);
  card.appendChild(meta);
  card.appendChild(body);

  return card;
}

async function loadNotes(ownerId, search) {
  const query = new URLSearchParams();
  if (ownerId) query.set("ownerId", ownerId);
  if (search) query.set("search", search);

  const result = await api(`/api/notes?${query.toString()}`);
  const notesList = document.getElementById("notes-list");
  notesList.replaceChildren(...result.notes.map(renderNote));
}

(async function bootstrapNotes() {
  try {
    const user = await loadCurrentUser();

    if (!user) {
      document.getElementById("notes-list").textContent = "Please log in first.";
      return;
    }

    document.getElementById("notes-owner-id").value = user.id;
    document.getElementById("create-owner-id").value = user.id;

    await loadNotes(user.id, "");
  } catch (error) {
    document.getElementById("notes-list").textContent = error.message;
  }
})();

document.getElementById("search-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  await loadNotes(formData.get("ownerId"), formData.get("search"));
});

document.getElementById("create-note-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const payload = {
    ownerId: formData.get("ownerId"),
    title: formData.get("title"),
    body: formData.get("body"),
    pinned: formData.get("pinned") === "on"
  };

  await api("/api/notes", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  await loadNotes(payload.ownerId, "");
  event.currentTarget.reset();
  document.getElementById("create-owner-id").value = payload.ownerId;
});
