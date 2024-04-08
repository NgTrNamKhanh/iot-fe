import {
  AddBusiness,
  Business,
  MenuOutlined,
  PeopleOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { BiSolidChat } from "react-icons/bi";
import { GiHealthIncrease } from "react-icons/gi";
import { ImProfile } from "react-icons/im";
import { RiHealthBookFill, RiMentalHealthFill } from "react-icons/ri";
import { SiWorldhealthorganization } from "react-icons/si";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { tokens } from "../../../theme";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};
const AdminSideBar = (currentUser) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  return (
    <Box
      sx={{
        position: "sticky",
        display: "flex",
        height: "100vh",
        top: 0,
        bottom: 0,
        zIndex: 10000,
        "& .sidebar": {
          border: "none",
        },
        "& .menu-icon": {
          backgroundColor: "transparent !important",
        },
        "& .menu-item": {
          // padding: "5px 35px 5px 20px !important",
          backgroundColor: "transparent !important",
        },
        "& .menu-anchor": {
          color: "inherit !important",
          backgroundColor: "transparent !important",
        },
        "& .menu-item:hover": {
          color: `${colors.blueAccent[500]} !important`,
          backgroundColor: "transparent !important",
        },
        "& .menu-item.active": {
          color: `${colors.greenAccent[500]} !important`,
          backgroundColor: "transparent !important",
        },
      }}
    >
      <Sidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlined /> : undefined}
            style={{
              margin: "1vh 0 2vh 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="1.5vh"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMIN
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlined />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="2.5vh">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100vh"
                  height="100vh"
                  src={currentUser.currentUser.avatar}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  fontSize="2.5vh"
                  paddingTop="3%"
                  sx={{ m: "1vh 0 0 0" }}
                >
                  {currentUser.currentUser.username}
                </Typography>
                <Typography
                  variant="h5"
                  fontSize="1.9vh"
                  color={colors.greenAccent[500]}
                >
                  {currentUser.currentUser.email}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Profile"
              to="/profile"
              icon={<ImProfile />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1.5vh 0 0.5vh 2vh" }}
            >
              Data
            </Typography>
            <Item
              title="User"
              to="/admin/user"
              icon={<PeopleOutlined />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Organisation"
              to="/admin/organisation"
              icon={<Business />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Health Recommendation"
              to="/health_recommendation-management/health_recommendations"
              icon={<RiMentalHealthFill style={{ fontSize: "2.5vh" }} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Health Objective"
              to="/health_objective-management/health_objectives"
              icon={<GiHealthIncrease style={{ fontSize: "2.5vh" }} />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1.5vh 0 0.5vh 2vh" }}
            >
              Forms
            </Typography>
            <Item
              title="Account Form"
              to="/admin/userform"
              icon={<PersonOutlined />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Organisation Form"
              to={"/admin/orgform"}
              icon={<AddBusiness />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Health Rec Form"
              to={"/admin/healthrecform"}
              icon={<RiHealthBookFill style={{ fontSize: "2.5vh" }} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Health Goal Form"
              to={"/admin/healthobjForm"}
              icon={<SiWorldhealthorganization style={{ fontSize: "2.5vh" }} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1.5vh 0 0.5vh 2vh" }}
            >
              Communication
            </Typography>
            <Item
              title="Inbox"
              to="/inbox"
              icon={<BiSolidChat style={{ fontSize: "2.5vh" }} />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default AdminSideBar;
