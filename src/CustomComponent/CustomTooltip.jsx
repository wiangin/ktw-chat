import { Tooltip, styled, tooltipClasses } from "@mui/material";

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: "14px",
  },
}));

export default CustomTooltip;
