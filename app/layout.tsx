import * as React from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";
import PsychologyIcon from "@mui/icons-material/Psychology";
import GitHubIcon from "@mui/icons-material/GitHub";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";

export const metadata = {
  title: "Mon Profil Cognitif",
  description: "A tool for neuropsychologists to visualize cognitive profiles.",
};

const DRAWER_WIDTH = 240;

const LINKS = [{ text: "Créer", href: "/evaluation", icon: AddIcon }];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AppBar position="fixed" sx={{ zIndex: 2000 }}>
            <Toolbar sx={{ backgroundColor: "background.paper" }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                href="/"
              >
                <PsychologyIcon fontSize="large" sx={{ color: "#444" }} />
              </IconButton>
              <Typography variant="h6" noWrap component="div" color="black">
                Mon profil cognitif
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              width: DRAWER_WIDTH,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
                boxSizing: "border-box",
                top: ["48px", "56px", "64px"],
                height: "auto",
                bottom: 0,
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <Divider />
            <List>
              {LINKS.map(({ text, href, icon: Icon }) => (
                <ListItem key={href} disablePadding>
                  <ListItemButton component={Link} href={href}>
                    <ListItemIcon>
                      <Icon />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ mt: "auto" }} />
          </Drawer>
          <Box
            component="main"
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              minHeight: "calc(100vh - 64px)",
              bgcolor: "background.default",
              ml: `${DRAWER_WIDTH}px`,
              mt: ["48px", "56px", "64px"],
              p: 3,
            }}
          >
            <div>{children}</div>
            <Box sx={{ mt: "auto" }}>
              <Divider />
              <Box
                component="footer"
                sx={{
                  py: 3,
                  px: 2,
                  mt: "auto",
                }}
              >
                <Container maxWidth="sm">
                  <Typography variant="body1" display="inline">
                    Tous droits réservés.
                  </Typography>
                  <Link
                    href="https://github.com/gruyaume/cognitive-profile"
                    passHref
                  >
                    <IconButton>
                      <GitHubIcon />
                    </IconButton>
                  </Link>
                </Container>
              </Box>
            </Box>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
