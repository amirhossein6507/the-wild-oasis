import SideNavigation from "../_components/SideNavigation";

function layout({ children }) {
  return (
    <div className="grid h-full grid-cols-[16rem_1fr]">
      <SideNavigation />

      <div>{children}</div>
    </div>
  );
}

export default layout;
