import React from "react"
import { View,Text, StyleSheet } from "react-native"
import StyledText from "./StyledText.jsx"



const Repositoryitem = (props) => (
  <View key={props.estado_id} style={styles.container}>
    <StyledText big bold>id:{props.estado_id}</StyledText>
    <StyledText small>nombre del estado:{props.nombre_estado}</StyledText>
    <StyledText blue>municipio:{props.municipios}</StyledText>
  </View>
)


const styles = StyleSheet.create({
  container :{
    padding: 20,
    paddingBottom:5,
    paddingTop:5
  }
}) 


export default Repositoryitem