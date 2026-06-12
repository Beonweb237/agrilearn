import { Routes, Route } from "react-router";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Toast from "@/components/Toast";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import CourseDetail from "./pages/CourseDetail";
import LessonPlayer from "./pages/LessonPlayer";
import MyLearning from "./pages/MyLearning";
import Certifications from "./pages/Certifications";
import Community from "./pages/Community";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen bg-sand-50">
      <Header />
      <Toast />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/course/:slug" element={<CourseDetail />} />
          <Route path="/lesson/:id" element={<LessonPlayer />} />
          <Route path="/my-learning" element={<MyLearning />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/community" element={<Community />} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
