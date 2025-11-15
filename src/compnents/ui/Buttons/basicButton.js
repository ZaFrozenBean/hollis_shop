import React from "react";
import { Button } from "@mui/material";

function BasicButton({
	children,
	variant = "contained",
	color = "primary",
	size = "medium",
	fullWidth = false,
	disabled = false,
	startIcon = null,
	endIcon = null,
	onClick,
	type = "button",
	sx = {},
	className = "",
	...props
}) {
	return (
		<Button
			variant={variant}
			color={color}
			size={size}
			fullWidth={fullWidth}
			disabled={disabled}
			startIcon={startIcon}
			endIcon={endIcon}
			onClick={onClick}
			type={type}
			sx={sx}
			className={className}
			{...props}
		>
			{children}
		</Button>
	);
}

export default BasicButton;
