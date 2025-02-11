import * as React from "react";
import { Box, Card, CardContent, Typography, CardActionArea, Button } from "@mui/material";
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EventIcon from "@mui/icons-material/Event";

const cards = [
    { id: 1, title: "Bookings", description: "Manage court bookings.", icon: <EventIcon fontSize="medium" sx={{ color: "black" }} /> },
    { id: 2, title: "Donations", description: "Track donations received.", icon: <VolunteerActivismIcon fontSize="medium" sx={{ color: "black" }} /> },
    { id: 3, title: "Users", description: "Manage registered users.", icon: <GroupAddIcon fontSize="medium" sx={{ color: "black" }} /> },
];

function SelectActionCard() {
    const [selectedCard, setSelectedCard] = React.useState(0);

    return (
        <Box sx={{ width: "100%", padding: 2 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                {/* Cards Grid */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: 2,
                        flexGrow: 1, // Ensures the cards take available space
                    }}
                >
                    {cards.map((card, index) => (
                        <Card key={card.id} sx={{ width: "100%" }}>
                            <CardActionArea
                                onClick={() => setSelectedCard(index)}
                                data-active={selectedCard === index ? "" : undefined}
                                sx={{
                                    height: "100%",
                                    "&[data-active]": {
                                        backgroundColor: "action.selected",
                                        "&:hover": {
                                            backgroundColor: "action.selectedHover",
                                        },
                                    },
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                                        {card.icon}
                                    </Box>
                                    <Typography variant="h5">{card.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {card.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default SelectActionCard;
