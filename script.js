const STORAGE_KEY = "ovs_demo_data_v1";
const candidates = ["Candidate A", "Candidate B", "Candidate C"];
const form = document.getElementById("voteForm");
const voterInput = document.getElementById("voterId");
const message = document.getElementById("formMessage");

function emptyData() {
  return { votes: [], blockedAttempts: 0, alerts: [] };
}
function loadData() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && Array.isArray(parsed.votes)) {
      return { ...emptyData(), ...parsed,
        votes: parsed.votes.filter(v => v && typeof v.voterId === "string" && candidates.includes(v.candidate)),
        alerts: Array.isArray(parsed.alerts) ? parsed.alerts : [] };
    }
  } catch (error) {
    console.warn("Could not read demo data:", error);
  }
  return emptyData();
}
let data = loadData();
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function normalizeId(value) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}
function addAlert(text) {
  data.alerts.unshift({ text, time: new Date().toLocaleTimeString() });
  data.alerts = data.alerts.slice(0, 8);
}
function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type || ""}`;
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const voterId = normalizeId(voterInput.value);
  const selected = form.querySelector('input[name="candidate"]:checked');
  if (!/^[A-Z0-9-]{3,30}$/.test(voterId)) {
    showMessage("Use 3–30 letters, numbers, or hyphens for the demo ID.", "error");
    return;
  }
  if (!selected) {
    showMessage("Please select a candidate.", "error");
    return;
  }
  if (data.votes.some(v => v.voterId === voterId)) {
    data.blockedAttempts += 1;
    addAlert(`Duplicate attempt blocked for demo ID ${voterId}.`);
    saveData();
    render();
    showMessage("This demo ID has already voted. Duplicate attempt was blocked.", "error");
    return;
  }
  data.votes.push({ voterId, candidate: selected.value, timestamp: new Date().toISOString() });
  addAlert(`Vote recorded for ${selected.value} under demo ID ${voterId}.`);
  saveData();
  render();
  form.reset();
  showMessage("Demo vote recorded successfully.", "success");
});
document.getElementById("refreshBtn").addEventListener("click", () => {
  data = loadData();
  render();
  showMessage("Results refreshed from this browser's saved demo data.", "");
});
document.getElementById("resetBtn").addEventListener("click", () => {
  const confirmed = window.confirm("Reset all demo votes and alerts in this browser?");
  if (!confirmed) return;
  data = emptyData();
  saveData();
  render();
  form.reset();
  showMessage("Demo data has been reset.", "success");
});
function render() {
  const total = data.votes.length;
  document.getElementById("totalVotes").textContent = `${total} vote${total === 1 ? "" : "s"}`;
  const results = document.getElementById("results");
  results.replaceChildren();
  candidates.forEach(candidate => {
    const count = data.votes.filter(v => v.candidate === candidate).length;
    const pct = total ? Math.round((count / total) * 100) : 0;
    const row = document.createElement("div");
    row.className = "result-row";
    const top = document.createElement("div");
    top.className = "result-top";
    const name = document.createElement("strong");
    name.textContent = candidate;
    const amount = document.createElement("span");
    amount.textContent = `${count} · ${pct}%`;
    top.append(name, amount);
    const bar = document.createElement("div");
    bar.className = "bar";
    const fill = document.createElement("span");
    fill.style.width = `${pct}%`;
    bar.append(fill);
    row.append(top, bar);
    results.append(row);
  });
  const unique = new Set(data.votes.map(v => v.voterId)).size;
  document.getElementById("uniqueVoters").textContent = unique;
  document.getElementById("duplicateAttempts").textContent = data.blockedAttempts;
  document.getElementById("alertsCount").textContent = data.alerts.length;
  const alertBox = document.getElementById("alerts");
  alertBox.replaceChildren();
  if (!data.alerts.length) {
    const item = document.createElement("div");
    item.className = "alert ok";
    item.textContent = "No alerts yet. Submit a duplicate demo ID to see the rule-based alert.";
    alertBox.append(item);
  } else {
    data.alerts.forEach(entry => {
      const item = document.createElement("div");
      item.className = "alert";
      item.textContent = `[${entry.time || "Earlier"}] ${entry.text}`;
      alertBox.append(item);
    });
  }
}
render();
