import { useContext, useMemo } from "react";
import {
  Box,
  Container,
  Divider,
  IconButton,
  Paper,
  SxProps,
  Tab,
  Tabs,
  Theme,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import DbContext from "../context/DbContext";

type BoardParams = {
  routeId: string;
  landmarkId?: string;
};

const Board = () => {
  const { routeId, landmarkId } = useParams<BoardParams>();
  const navigate = useNavigate();
  const { routes, landmarks } = useContext(DbContext);

  const route = useMemo(() => {
    for (let i = 0; i < routes.length; ++i) {
      if (routes[i].name === routeId) {
        return routes[i];
      }
    }
    return null;
  }, [routes, routeId]);

  const landmark = useMemo(() => {
    for (let i = 0; i < landmarks.length; ++i) {
      if (landmarks[i].name === landmarkId) {
        return landmarks[i];
      }
    }
    return null;
  }, [landmarks, landmarkId]);

  const content = useMemo(() => {
    if (route === null) return "";
    return (
      (landmark !== null
        ? `![${landmark.name}](/landmarks/${landmark.name}/${landmark.name}.jpg)`
        : "") + (landmark ?? route).description
    );
  }, [route, landmark]);

  if (!route) {
    return null;
  }

  return (
    <Container
      maxWidth="xs"
      sx={{
        ...rootSx,
        left: 8,
      }}
    >
      <Paper sx={paperSx}>
        <Box sx={titleSx}>
          <Typography variant="h6">{route.name}</Typography>
          <IconButton onClick={() => navigate("/map")}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        {route.landmarks.length && (
          <Tabs value={landmarkId ?? "路線"}>
            <Tab
              value="路線"
              label="路線"
              onClick={() => navigate(`/map/${routeId}`)}
            />
            {route.landmarks.map((name) => (
              <Tab
                key={`${routeId}-${name}-tab`}
                value={name}
                label={name}
                onClick={() => navigate(`/map/${routeId}/${name}`)}
              />
            ))}
          </Tabs>
        )}
        <Box sx={contentSx}>
          <ReactMarkdown
            components={{
              img: ({ ...props }) => (
                <img style={{ maxWidth: "100%" }} {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </Box>
        <Box sx={backgroundSx} />
      </Paper>
    </Container>
  );
};

export default Board;

const rootSx: SxProps<Theme> = {
  position: "fixed",
  top: (t) => t.spacing(8),
  left: (t) => t.spacing(8),
  zIndex: 1000,
  "@media (max-width: 500px)": {
    width: "80%",
  },
};

const paperSx: SxProps<Theme> = {
  position: "relative",
  height: "80vh",
  display: "flex",
  flexDirection: "column",
};

const backgroundSx: SxProps<Theme> = {
  position: "absolute",
  bottom: "5%",
  right: "5%",
  width: 192,
  height: 192,
  filter: "invert(1)",
  opacity: 0.15,
  pointerEvents: "none",
  backgroundImage: "url(/typeople.png)",
  backgroundRepeat: "no-repeat",
  backgroundBlendMode: "difference",
};

const titleSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  textAlign: "left",
  p: 2,
};

const contentSx: SxProps<Theme> = {
  textAlign: "left",
  p: 2,
  overflow: "scroll",
  flex: 1,
};
