import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
const Sidebarr = () => {
  return (
    <Sidebar>
      <Menu>
        <MenuItem> Dashboard </MenuItem>
        <SubMenu label="Master Entry">
          <MenuItem> Pie charts </MenuItem>
          <MenuItem> Line charts </MenuItem>
        </SubMenu>
        <SubMenu label="Student Management">
          <MenuItem> Pie charts </MenuItem>
          <MenuItem> Line charts </MenuItem>
        </SubMenu>
        {/* <MenuItem> Documentation </MenuItem>
        <MenuItem> Calendar </MenuItem> */}
      </Menu>
    </Sidebar>
  );
};

export default Sidebarr;
