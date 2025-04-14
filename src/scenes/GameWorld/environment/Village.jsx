import React from "react";
import Land from "../../../components/3D Objects/Land"; 
import Houses from "../../../components/3D Objects/Houses"; 
import Tree2 from "../../../components/3D Objects/Tree2";
import Tree1 from "../../../components/3D Objects/Tree1";
import Grove from "../../../components/3D Objects/Grove";
import Grass from "../../../components/3D Objects/Grass";
import HousePrincipal from "../../../components/3D Objects/HousePrincipal";
import ToolsWorld from "../../../components/3D Objects/ToolsWorld";

export function Village(props) {
  return (
    <group {...props}>
      <Land />
      <Houses />
      <Tree1 />
      <Tree1 position-x={[10]} />
      <Tree1 position-x={[15]} />
      <Tree1 position-x={[20]} />
      <Tree1 position-z={[10]} />
      <Tree1 position-z={[-10]} />
      <Tree2 />
      <Tree2 position-x={[10]}/>
      <Tree2 position-x={[15]}/>
      <Tree2 position-x={[20]}/>
      <Tree2 position-z={[5]}/>
      <Tree2 position-z={[-5]}/>
      <Grove />
      <Grass />
      <Grass position-x={[-20]}/>
      <Grass position-z={[-30]}/>
      <Grass position-z={[-10]}/>
      <Grass position={[40,0,-30]}/>
      <Grass position={[20,0,-10]}/>
      <HousePrincipal />
      <ToolsWorld />
    </group>
  );
}

export default Village;
