import { AddBox, EditOutlined } from "@mui/icons-material";
import { Box, Button, Drawer, Link, Typography } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import useFetch from "../../hooks/useFetch";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";
import AssignDeviceForm from "../form/assignDevice";
import DeviceBox from "./DeviceBox";

const UserDevices = () => {
  const { data, loading, error, reFetch } = useFetch(apis.device + "devices");
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(data);
  useEffect(() => {
    const fetchData = async () => {
      localStorage.setItem("user_devices", JSON.stringify(data));
    };
    fetchData();
  }, [data]);
  const [clickedDevice, setClickedDevice] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDeviceClick = (device) => {
    setClickedDevice(device);
    setDrawerOpen(true);
  };
  const handleDrawerClose = async () => {
    // await reFetch();
    setClickedDevice(null);
    setDrawerOpen(false);
  };
  const formatCreatedTime = (createdTime) => {
    const date = new Date(createdTime);
    return date.toLocaleString("en-US", {
      year: "numeric",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const handleOpenAssignDialog = () => {
    setAssignDialogOpen(true);
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
  };
  const handleUnassignDevice = async () => {
    setIsSubmitting(true);
    const assignDevice = {
      owner: clickedDevice.ownerUserName,
      device_id: clickedDevice.id,
    };
    console.log(assignDevice);
    try {
      // Make a request to unassign the device
      await axios.post(`${apis.device}device/unassign`, assignDevice, {
        headers: authHeader(),
        withCredentials: true,
      });
      handleDrawerClose();
      setIsSubmitting(false);
      await reFetch();
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error unassigning device:", error);
      // Handle error, maybe show a notification to the user
    }
  };
  const [editedName, setEditedName] = useState();
  useEffect(() => {
    if (clickedDevice) {
      setEditedName(clickedDevice.name);
    }
  }, [clickedDevice]);
  const [submitLoading, setSubmitLoading] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false);
  const handleSaveName = async () => {
    setSubmitLoading(true)
    try {
      const editDevice = {
        id: clickedDevice.id,
        name: editedName,
      };
      await axios.post(`${apis.device}device/edit`, editDevice, {
        headers: authHeader(),
        withCredentials: true,
      });
      handleDrawerClose();
      setEditedName("");
      setSubmitLoading(false)
      setIsEditingName(false);

      await reFetch();
    } catch (err) {
      handleDrawerClose();
      setEditedName("");
      setSubmitLoading(false)
      setIsEditingName(false);
      console.log(err);
    }
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    // Reset the edited name to the original device name
    setEditedName(clickedDevice.name);
  };

  const handleChangeName = (event) => {
    setEditedName(event.target.value);
  };

  return (
    <Box m="3vh">
      <Header title="Devices" subtitle="Managing your own devices" />
      <Link>
        <AddBox
          onClick={() => handleOpenAssignDialog()}
          sx={{ color: "red" }}
        />
      </Link>
      <div className="app-container">
        {loading ? (
          <Box style={{ width: "100vh" }}>
            {Array(10)
              .fill()
              .map((_, i) => (
                <>
                  <Skeleton />
                  <Skeleton animation={i % 2 === 0 ? "wave" : false} />
                </>
              ))}
          </Box>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          data &&
          data.map((device) => (
            <DeviceBox
              key={device.id}
              status={device._active ? "Online" : "Offline"}
              latestData={device.additional_info}
              deviceName={device.name}
              isClicked={clickedDevice && clickedDevice.name === device.name}
              onClick={() => handleDeviceClick(device)}
            />
          ))
        )}
      </div>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        width={300}
      >
        <Box p={2}>
          <Typography variant="h5">Device Information</Typography>

          {clickedDevice && (
            <div>
              <Typography variant="subtitle1">{`Device Name: ${clickedDevice.name}`}</Typography>
              {isEditingName ? (
                <div>
                  <input
                    type="text"
                    value={editedName}
                    onChange={handleChangeName}
                    disabled={submitLoading}
                  />
                  <button onClick={handleSaveName} disabled={submitLoading}>{submitLoading? 'Loading...':'Save'}</button>
                  <button onClick={handleCancelEditName} disabled={submitLoading}>Cancel</button>
                </div>
              ) : (
                <EditOutlined
                  onClick={() => setIsEditingName(true)}
                  style={{ marginRight: "2vh" }}
                />
              )}
              <Typography variant="subtitle1">{`Type: ${clickedDevice.type}`}</Typography>
              <Typography variant="subtitle1">{`Status: ${
                clickedDevice._active ? "Online" : "Offline"
              }`}</Typography>
              <Typography variant="subtitle1">{`Created Time: ${formatCreatedTime(
                clickedDevice.created_time
              )}`}</Typography>
              {clickedDevice.picture && (
                <img
                  src={clickedDevice.picture}
                  alt={`Device ${clickedDevice.name} Picture`}
                  style={{ maxWidth: "100%", marginTop: "10px" }}
                />
              )}
              <Box sx={{marginTop: '10px'}}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleUnassignDevice}
                  disabled={isSubmitting && submitLoading}
                >
                  {isSubmitting ? <span>Loading...</span> : "Unassign"}
                </Button>
              </Box>
            </div>
          )}
        </Box>
      </Drawer>
      {assignDialogOpen && (
        <AssignDeviceForm
          handleClose={handleCloseAssignDialog}
          reFetch={reFetch}
          isManager={false}
        />
      )}
    </Box>
  );
};

export default UserDevices;
