import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BloodPressure from "../components/Device/BloodPressure/BloodPressure";
import HeartRate from "../components/Device/HeartRate/HeartRate";
import Temperature from "../components/Device/Temperature/Temperature";
import apis from "../services/api-service";
import authHeader from "../services/auth-header";
import authService from "../services/auth.service";
import {Box} from "@mui/material"
import Skeleton from "@mui/material/Skeleton";
import "../css/health-record.css";
const HealthRecord = () => {
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [formattedDate, setFormattedDate] = useState(
    format(selectedDate, "yyyy-MM-dd")
  );
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = format(date, "yyyy-MM-dd");
    console.log(formattedDate);
    setFormattedDate(formattedDate);
  };
  const user = authService.getCurrentUser();
  const [dayData, setDayData] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  useEffect(() => {
    if (user) {
      if (selectedDate !== undefined) {
        // Fetch month data first
        const fetchMonthData = async () => {
          try {
            const monthDataResponse = await axios.get(
              apis.healthRecordManagement + "health_history/month",
              {
                params: {
                  id: user.id,
                  date: selectedDate,
                },
                headers: authHeader(),
                withCredentials: true,
              }
            );
            setMonthData(monthDataResponse.data);
          } catch (error) {
            console.error("Error fetching month data:", error);
          }
        };

        // Fetch week data after month data
        const fetchWeekData = async () => {
          try {
            const weekDataResponse = await axios.get(
              apis.healthRecordManagement + "health_history/week",
              {
                params: {
                  id: user.id,
                  date: selectedDate,
                },
                headers: authHeader(),
                withCredentials: true,
              }
            );
            setWeekData(weekDataResponse.data);
          } catch (error) {
            console.error("Error fetching week data:", error);
          }
        };

        // Fetch day data after week data
        const fetchDayData = async () => {
          try {
            const dayDataResponse = await axios.get(
              apis.healthRecordManagement + "health_history/day",
              {
                params: {
                  id: user.id,
                  date: selectedDate,
                },
                headers: authHeader(),
                withCredentials: true,
              }
            );
            setDayData(dayDataResponse.data);
          } catch (error) {
            console.error("Error fetching day data:", error);
          }
        };

        // Fetch data sequentially: month -> week -> day
        const fetchDataSequentially = async () => {
          setLoading(true)
          await fetchDayData();
          await fetchMonthData();
          await fetchWeekData();
          setLoading(false)
        };

        // Start fetching data
        fetchDataSequentially();

        // fetchDayData();
        // fetchMonthData();
        // fetchWeekData();
      }
    }
  }, [selectedDate]);
  console.log(formattedDate);
  return (
    <div className="container">
      <Box>
        <DatePicker selected={selectedDate} onChange={handleDateChange} disabled={loading}/>
      </Box>
      {loading ? (
        <Box>
          {Array(14)
            .fill()
            .map((_, i) => (
              <>
                <Skeleton />
                <Skeleton animation={i % 2 === 0 ? "wave" : false} />
              </>
            ))}
        </Box>
      ) : (
          <div className="chartContainer">
            <div className="chartItem">
              <HeartRate 
                dayData={dayData} 
                weekData={weekData} 
                monthData={monthData}
              />
            </div>
            <div className="chartItem">
              <Temperature
                dayData={dayData}
                weekData={weekData}
                monthData={monthData}
              />
            </div>
            <div className="chartItem">
              <BloodPressure
                dayData={dayData}
                weekData={weekData}
                monthData={monthData}
              />
            </div>
          </div>
      )}
      
      
    </div>
  );
};
export default HealthRecord;
