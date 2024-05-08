import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Skeleton, Typography, colors, useTheme } from "@mui/material";
import useFetch from "../../hooks/useFetch";
import apis from "../../services/api-service";
import axios from "axios";
import authHeader from "../../services/auth-header";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";

const UserHealthProgress = ({user,handleCloseDefault}) => {
    const [loading, setLoading] = useState(true)
    const [healthrecord, setHealthRecord] = useState()
    const [error, setError] = useState();
    const [lastUpdate, setLastUpdate] = useState();
    useEffect(() => {
        setLoading(true);
        if (user) {
            const fetchMonthData = async () => {
            try {
                const dataResponse = await axios.get(
                apis.healthRecordManagement + "health_record",
                {
                    params: {
                    id: user.id,
                    },
                    headers: authHeader(),
                    withCredentials: true,
                }
                );
                setHealthRecord(dataResponse.data);
                formatDate(dataResponse.data)
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error.response.data)
                console.error("Error fetching month data:", error);
            }
            };
            fetchMonthData()
        }
    }, [user]);
    const formatDate=(healthrecord)=>{
        const lastUpdatedDateTime = new Date(healthrecord.last_updated);

        // Get the components of the date
        const day = lastUpdatedDateTime.getDate();
        const month = lastUpdatedDateTime.getMonth() + 1; 
        const year = lastUpdatedDateTime.getFullYear();
        const hour = lastUpdatedDateTime.getHours();
        const minute = lastUpdatedDateTime.getMinutes();
    
        // Convert hour to 12-hour format
        const hour12 = hour % 12 || 12;
        const ampm = hour < 12 ? 'am' : 'pm';
    
        setLastUpdate(`${day}/${month}/${year} ${hour12}:${minute < 10 ? '0' : ''}${minute}${ampm}`);
    }
    
    const theme = useTheme();
    const customColors = tokens(theme.palette.mode);
    return (
        <Dialog open={true} onClose={handleCloseDefault}>
            <DialogTitle>{user.username}'s Health </DialogTitle>
            <DialogContent>
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
                    <>
                        {error ? (
                            <Typography
                            sx={{ color: colors.deepOrange[700], fontSize: "1.6vh" }}
                            >
                            {error}
                            </Typography>
                        ) : (
                            <Grid container spacing={3} alignItems="center">
                                <Grid item xs={4}>
                                    <Typography variant="h4" align="center">Heart Rate</Typography>
                                    <Typography variant="h2" align="center" sx={{ color: customColors.greenAccent[500] }}>{healthrecord.heart_rate}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="h4" align="center">Blood Pressure</Typography>
                                    <Typography variant="h2" align="center" sx={{ color: customColors.greenAccent[500] }}>{healthrecord.blood_pressure}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="h4" align="center">Temperature</Typography>
                                    <Typography variant="h2" align="center" sx={{ color: customColors.greenAccent[500] }}>{healthrecord.temperature}</Typography>
                                </Grid>
                                <Grid item xs={12} align="center">
                                    <Typography variant="h4">Last Updated: {lastUpdate}</Typography>
                                </Grid>
                            </Grid>

                        )}
                    </>
                )}
            </DialogContent>
            
            <DialogActions
                style={{
                marginTop: "4% !important",
                marginRight: "-2% !important",
                }}
            >

                <Button
                    className="cancel-btn"
                    onClick={handleCloseDefault}
                >
                Cancel
                </Button>
          </DialogActions>
        </Dialog>
    );
}
export default UserHealthProgress;