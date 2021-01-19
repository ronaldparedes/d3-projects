import React from "react"
import Header from "../components/header"
// import CustomCursor from "../components/CustomCursor"
import Layout from "../components/layout"

export default function Home() {
  return (
    <Layout>
      {/* <CustomCursor /> */}
      <Header headerText="Hellow Gatsby" />
      <p>What a world.</p>
      <img src="https://source.unsplash.com/random/400x200" alt="" />
    </Layout>
  )
}
