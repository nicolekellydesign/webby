import axios from "axios";

/* GET queries */

export async function AboutQuery() {
  const about = await axios.get("/api/v1/about");
  return about.data;
}

export async function PhotosQuery() {
  const photos = await axios.get("/api/v1/photos");
  return photos.data;
}

export async function ProjectQuery(name: string) {
  const projects = await axios.get(`/api/v1/gallery/${name}`);
  return projects.data;
}

export async function ProjectsQuery() {
  const projects = await axios.get("/api/v1/gallery");
  return projects.data;
}

export async function UsersQuery() {
  const users = await axios.get("/api/v1/admin/users");
  return users.data;
}
