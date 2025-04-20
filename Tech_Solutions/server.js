const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let proyectos = [
  { id: 1, nombre: "Sitio Web", fechaInicio: "2025-04-01", estado: "Activo", responsable: "Ignacio", monto: 1500000 },
  { id: 2, nombre: "App Móvil", fechaInicio: "2025-04-10", estado: "Pendiente", responsable: "Camila", monto: 3000000 }
];

let idActual = 3;

app.get("/proyectos", (req, res) => {
  res.render("listar", { proyectos });
});

app.get("/proyectos/crear", (req, res) => {
  res.render("crear");
});

app.post("/proyectos", (req, res) => {
  const nuevo = { id: idActual++, ...req.body };
  proyectos.push(nuevo);
  res.redirect("/proyectos");
});

app.get("/proyectos/:id", (req, res) => {
  const proyecto = proyectos.find(p => p.id == req.params.id);
  res.render("detalle", { proyecto });
});

app.get("/proyectos/:id/editar", (req, res) => {
  const proyecto = proyectos.find(p => p.id == req.params.id);
  res.render("editar", { proyecto });
});

app.post("/proyectos/:id", (req, res) => {
  const idx = proyectos.findIndex(p => p.id == req.params.id);
  proyectos[idx] = { id: parseInt(req.params.id), ...req.body };
  res.redirect("/proyectos");
});

app.get("/proyectos/:id/eliminar", (req, res) => {
  proyectos = proyectos.filter(p => p.id != req.params.id);
  res.redirect("/proyectos");
});

app.get("/uf", async (req, res) => {
  try {
    const response = await axios.get("https://mindicador.cl/api/uf");
    const ufHoy = response.data.serie[0].valor;
    res.render("uf", { valorUF: ufHoy });
  } catch (error) {
    res.send("Error al obtener la UF");
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
