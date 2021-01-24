import React from "react"
import Layout from "../components/layout"
import { Height } from "../styles/variables"
import { withPrefix } from "gatsby"

export default function Histogram() {
  return (
    <Layout theme={{ backgroundColor: "black" }}>
      <iframe
        src={withPrefix("/histogram/histogram.html")}
        title="D3 Histogram"
        style={{
          width: "100%",
          height: `calc(100vh - ${Height.header})`,
          border: "none",
          overflow: "hidden",
        }}
      ></iframe>
    </Layout>
  )
}
