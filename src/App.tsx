import { useEffect } from "react";
import { useHashRoute, nav, routeParts } from "./lib/router";
import { K, loadJSON } from "./lib/store";
import { getCase } from "./data/cases";
import { Shell } from "./components/Layout";
import Landing from "./pages/Landing";
import Identity, { IdentityForm } from "./pages/Identity";
import Dashboard from "./pages/Dashboard";
import CaseWorkspace from "./pages/CaseWorkspace";
import Review from "./pages/Review";
import Portfolio from "./pages/Portfolio";
import Lecturer from "./pages/Lecturer";
import Settings from "./pages/Settings";
import { Card, Btn } from "./components/ui";

function requireStudent(route: string): boolean {
  // halaman yang memerlukan identitas mahasiswa
  return ["/dashboard", "/kasus", "/portfolio", "/refleksi", "/profil", "/pengaturan"].some((p) => route === p || route.startsWith(p + "/"));
}

export default function App() {
  const route = useHashRoute();
  const student = loadJSON(K.student, { nama: "" });

  useEffect(() => {
    if (requireStudent(route) && !student.nama) {
      nav("/identitas");
    }
  }, [route, student.nama]);

  useEffect(() => {
    // sinkronkan pilihan tema saat aplikasi dimuat
    const t = loadJSON<string>(K.theme, "light");
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  if (route === "/" || route === "") return <Landing />;
  if (route === "/identitas") return <Identity />;

  const parts = routeParts(route);

  // guard render (redirect berjalan di effect)
  if (requireStudent(route) && !student.nama) return <Identity />;

  let content: React.ReactNode;
  if (route === "/dashboard") content = <Dashboard />;
  else if (route === "/profil") content = <IdentityForm embedded />;
  else if (route === "/portfolio") content = <Portfolio />;
  else if (route === "/refleksi") content = <Portfolio focusReflection />;
  else if (route === "/pengajar") content = <Lecturer />;
  else if (route === "/pengaturan") content = <Settings />;
  else if (parts[0] === "kasus" && parts[1]) {
    const caseData = getCase(parts[1]);
    if (!caseData) {
      content = (
        <Card className="py-14 text-center">
          <p className="font-serif text-lg italic text-navy-400">Kasus tidak ditemukan.</p>
          <Btn className="mt-4" onClick={() => nav("/dashboard")}>Kembali ke Dashboard</Btn>
        </Card>
      );
    } else if (parts[2] === "review") {
      content = <Review caseData={caseData} />;
    } else {
      content = <CaseWorkspace caseData={caseData} secParam={parts[2]} />;
    }
  } else {
    content = (
      <Card className="py-14 text-center">
        <p className="font-serif text-lg italic text-navy-400">Halaman tidak ditemukan.</p>
        <Btn className="mt-4" onClick={() => nav("/dashboard")}>Ke Dashboard</Btn>
      </Card>
    );
  }

  return <Shell route={route}>{content}</Shell>;
}
