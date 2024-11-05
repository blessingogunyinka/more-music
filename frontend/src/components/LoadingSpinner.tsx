import "../styles/LoadingSpinner.css" 


interface LoadingSpinnerProps {
    marginTopProp?: string
    marginBottomProp?: string
    marginLeftProp?: string,
    topProp?: string,
    leftProp?: string,
    positionProp?: "static" | "relative" | "absolute" | "sticky" | "fixed"
}

export default function LoadingSpinner( { marginTopProp, marginBottomProp, marginLeftProp, topProp, leftProp, positionProp }: LoadingSpinnerProps) {
	return (
		<svg 
            className="loading-spinner" 
            viewBox="0 0 32 32" 
            style={{ 
                marginTop: marginTopProp,
                marginBottom: marginBottomProp,
                marginLeft: marginLeftProp,
                top: topProp,
                left: leftProp,
                position: positionProp
            }}
        >
            <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={{ stroke: "rgb(29, 155, 240)", opacity: "0.2"}}></circle>
            <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={{ stroke: "rgb(29, 155, 240)", strokeDasharray: "80", strokeDashoffset: "60" }}></circle>      
        </svg>
	) ; 
}