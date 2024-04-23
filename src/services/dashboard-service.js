import axios from "axios";
import apis from "./api-service";
import authHeader from "./auth-header";

const viewPercentageOfHealthObjectivesSelectedByUser = () => {
  return axios.get(apis.dashboard + `health-objectives`, {
    headers: authHeader(),
    widthCredentials: true,
  });
};

const DashBoardService = {
  viewPercentageOfHealthObjectivesSelectedByUser,
};

export default DashBoardService;
