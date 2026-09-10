import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  ClipboardList,
  FileCheck,
  HelpCircle,
  Users,
  TrendingUp,
  CalendarDays,
  MessageCircleQuestion,
  ShoppingCart,
  CreditCard,
  TicketPercent,
  Award,
  UserRound,
  MessageSquareQuote,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,

  GraduationCap,
  AwardIcon,
} from "lucide-react";

const menuSections = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "LEARNING",
    items: [
      {
        label: "Courses",
        path: "/admin/courses",
        icon: BookOpen,
      },
      {
        label: "Certificates",
        path: "/admin/certificates",
        icon: AwardIcon,
      },
      // {
      //   label: "Modules & Lessons",
      //   path: "/admin/lessons",
      //   icon: Video,
      // },
      // {
      //   label: "Assignments",
      //   path: "/admin/assignments",
      //   icon: ClipboardList,
      // },
      // {
      //   label: "Submissions",
      //   path: "/admin/submissions",
      //   icon: FileCheck,
      // },
      // {
      //   label: "Quizzes",
      //   path: "/admin/quizzes",
      //   icon: HelpCircle,
      // },
      // {
      //   label: "Question Bank",
      //   path: "/admin/question-bank",
      //   icon: ClipboardList,
      // },
      // {
      //   label: "Quiz Attempts",
      //   path: "/admin/quiz-attempts",
      //   icon: FileCheck,
      // },
    ],
  },

  {
    title: "STUDENTS",
    items: [
      {
        label: "Students",
        path: "/admin/students",
        icon: Users,
      },
      {
        label: "Doubt & Support",
        path: "/admin/doubt-sessions",
        icon: HelpCircle,
      },
      // {
      //   label: "Progress",
      //   path: "/admin/progress",
      //   icon: TrendingUp,
      // },
    ],
  },

  // {
  //   title: "ENGAGEMENT",
  //   items: [
  //     {
  //       label: "Doubt Sessions",
  //       path: "/admin/doubt-sessions",
  //       icon: CalendarDays,
  //     },
  //     {
  //       label: "Student Doubts",
  //       path: "/admin/doubts",
  //       icon: MessageCircleQuestion,
  //     },
  //     {
  //       label: "Announcements",
  //       path: "/admin/announcements",
  //       icon: MessageSquareQuote,
  //     },
  //   ],
  // },

  // {
  //   title: "SALES",
  //   items: [
  //     {
  //       label: "Orders",
  //       path: "/admin/orders",
  //       icon: ShoppingCart,
  //     },
  //     {
  //       label: "Payments",
  //       path: "/admin/payments",
  //       icon: CreditCard,
  //     },
  //     {
  //       label: "Coupons",
  //       path: "/admin/coupons",
  //       icon: TicketPercent,
  //     },
  //   ],
  // },

  // {
  //   title: "CERTIFICATION",
  //   items: [
  //     {
  //       label: "Certificates",
  //       path: "/admin/certificates",
  //       icon: Award,
  //     },
  //   ],
  // },

  // {
  //   title: "CONTENT",
  //   items: [
  //     {
  //       label: "Instructors",
  //       path: "/admin/instructors",
  //       icon: UserRound,
  //     },
  //     {
  //       label: "Testimonials",
  //       path: "/admin/testimonials",
  //       icon: MessageSquareQuote,
  //     },
  //     {
  //       label: "FAQs",
  //       path: "/admin/faqs",
  //       icon: HelpCircle,
  //     },
  //   ],
  // },

  // {
  //   title: "ANALYTICS",
  //   items: [
  //     {
  //       label: "Reports",
  //       path: "/admin/reports",
  //       icon: BarChart3,
  //     },
  //   ],
  // },

  {
    title: "SYSTEM",
    items: [
      {
        label: "Settings",
        path: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <aside
      className={`
        fixed left-0 top-0 z-50 h-screen
        border-r border-slate-200
        bg-white
        transition-all duration-300
        ${collapsed ? "w-[80px]" : "w-[270px]"}
      `}
    >
      {/* Logo */}
      <div
        className="
          flex h-[72px] items-center
          border-b border-slate-200
          px-5
        "
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="
              flex h-12 w-12 shrink-0 items-center justify-center
              rounded-xl text-white
            "
          >
            <img src={Logo} alt="DigiCampus Logo" className="h-full w-full object-contain" />
          </div>

          {!collapsed && (
            <div className="whitespace-nowrap">
              <h1 className="text-[15px] font-bold text-slate-900">
                VidyaUdbhav Academy
              </h1>

              <p className="text-[11px] text-slate-500">
                Admin CMS
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="h-[calc(100vh-72px)] overflow-y-auto px-3 py-5">
        {menuSections.map((section) => (
          <div key={section.title} className="mb-6">
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.14em] text-slate-400">
                {section.title}
              </p>
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/admin"}
                    title={collapsed ? item.label : ""}
                    className={({ isActive }) =>
                      `
                      group flex items-center gap-3 rounded-xl
                      px-3 py-2.5
                      text-sm font-medium
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }
                      ${collapsed ? "justify-center" : ""}
                      `
                    }
                  >
                    <Icon size={18} strokeWidth={1.9} />

                    {!collapsed && (
                      <span className="whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          absolute -right-3 top-[82px]
          flex h-7 w-7 items-center justify-center
          rounded-full border border-slate-200
          bg-white text-slate-600
          shadow-sm
          hover:bg-slate-50
        "
      >
        {collapsed ? (
          <ChevronRight size={15} />
        ) : (
          <ChevronLeft size={15} />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;