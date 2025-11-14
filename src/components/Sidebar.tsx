import { NavLink, useLocation } from "react-router-dom";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { navigationConfig } from "@/config/navigation";

const mainNavItems = navigationConfig.filter(item => item.type === 'main');
const footerNavItem = navigationConfig.find(item => item.type === 'footer');

const NavItem = ({ to, label, Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-4 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary"
      )
    }
  >
    <Icon className="h-5 w-5" />
    {label}
  </NavLink>
);

export const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-16 items-center border-b px-4 lg:h-[64px] lg:px-6">
          <NavLink to="/" className="flex items-center gap-3 font-semibold">
            <Wrench className="h-7 w-7 text-primary" />
            <span className="text-xl">Autoparts</span>
          </NavLink>
        </div>
        <div className="flex flex-1 flex-col justify-between py-4">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
            {mainNavItems.map((item) =>
              item.subItems ? (
                <Accordion key={item.label} type="single" collapsible defaultValue={item.subItems.some(p => location.pathname.startsWith(p.to)) ? item.label : ""}>
                  <AccordionItem value={item.label} className="border-b-0">
                    <AccordionTrigger className="py-3 hover:no-underline rounded-lg px-3 [&[data-state=open]]:bg-muted">
                      <div className={cn("flex items-center gap-4 text-muted-foreground", { "text-primary": item.subItems.some(p => location.pathname.startsWith(p.to)) })}>
                        <item.Icon className="h-5 w-5" />
                        {item.label}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1">
                      <div className="flex flex-col gap-1 pl-8">
                        {item.subItems.map((subItem) => (
                          <NavItem key={subItem.label} {...subItem} />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                item.to && <NavItem key={item.label} to={item.to} label={item.label} Icon={item.Icon} />
              )
            )}
          </nav>
          {footerNavItem && footerNavItem.to && (
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavItem key={footerNavItem.label} to={footerNavItem.to} label={footerNavItem.label} Icon={footerNavItem.Icon} />
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};