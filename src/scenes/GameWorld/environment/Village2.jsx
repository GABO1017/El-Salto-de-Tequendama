import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

export function Village2(props) {
  const { nodes, materials } = useGLTF("/models/Map_Muisca2.glb");
  return (
    <group {...props} dispose={null}>
      <RigidBody type="fixed" colliders="trimesh" name="village" >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Landscape007.geometry}
          material={nodes.Landscape007.material}
          position={[0, -0.175, 0]}
          />
        </RigidBody>
        <mesh
            castShadow
            receiveShadow
            geometry={nodes.Landscape0070.geometry}
            material={materials.plants_1_atlas_mat}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Landscape0071.geometry}
            material={materials["plants atlas 2 mat "]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Landscape0072.geometry}
            material={materials["plants atlas 6 mat"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Landscape0074.geometry}
            material={materials.rocks_01_mat}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Landscape0075.geometry}
            material={materials.rocks_01_mat}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Thatched_roof_4.geometry}
            material={materials.straw}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Thatched_roof_5.geometry}
            material={materials.Clay}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Thatched_roof_6.geometry}
            material={materials.wood1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.tree004.geometry}
            material={materials.tree_02_mat}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.tree004_1.geometry}
            material={materials["bark 1 mat"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.leaves003.geometry}
            material={materials.tree_07_mat}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.leaves003_1.geometry}
            material={materials.bark_02}
          />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Land.geometry}
          material={materials["Grass Land"]}
          position={[0, 1.834, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Grove1.geometry}
          material={materials["Forest Ground"]}
          position={[-14.446, 0.381, 7.125]}
          rotation={[0, -0.857, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Grove2.geometry}
          material={materials["Forest Ground"]}
          position={[-3.529, 0.247, 8.537]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Grove3.geometry}
          material={materials["Forest Ground"]}
          position={[-3.51, 0.192, 10.716]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Grove4.geometry}
          material={materials["Forest Ground"]}
          position={[-10.608, 0.167, -8.014]}
          rotation={[0, 1.432, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Grove5.geometry}
          material={materials["Forest Ground"]}
          position={[-12.769, 0.222, -8.295]}
          rotation={[0, 1.432, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.HomeClay.geometry}
          material={materials.Clay}
          position={[-14.372, 1.294, 0]}
          rotation={[0, 0.528, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Roof.geometry}
          material={materials.straw}
          position={[-14.372, 1.294, 0]}
          rotation={[0, 0.528, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1001.geometry}
          material={materials.wood2}
          position={[-14.372, 1.294, 0]}
          rotation={[0, 0.528, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood2001.geometry}
          material={materials.wood2}
          position={[-14.372, 1.294, 0]}
          rotation={[0, 0.528, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood3001.geometry}
          material={materials.wood2}
          position={[-14.372, 1.294, 0]}
          rotation={[0, 0.528, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood4.geometry}
          material={materials.wood2}
          position={[-14.372, 1.294, 0]}
          rotation={[0, 0.528, 0]}
        />
        <group position={[-6.202, 0.399, -8.118]} rotation={[0, 0.48, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Thatched_roof_1.geometry}
            material={materials.straw}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Thatched_roof_2.geometry}
            material={materials.Clay}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Thatched_roof_3.geometry}
            material={materials.wood1}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood3004.geometry}
          material={materials.wood1}
          position={[-12.354, 0.81, 10.523]}
          rotation={[-Math.PI, 1.346, -Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood2004.geometry}
          material={materials.wood1}
          position={[-12.354, 0.81, 10.523]}
          rotation={[-Math.PI, 1.346, -Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1006.geometry}
          material={materials.wood1}
          position={[-12.354, 0.81, 10.523]}
          rotation={[-Math.PI, 1.346, -Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Thatched_roof003.geometry}
          material={materials.straw}
          position={[-12.354, 0.81, 10.523]}
          rotation={[-Math.PI, 1.346, -Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ClayHouse003.geometry}
          material={materials.Clay}
          position={[-12.354, 0.81, 10.523]}
          rotation={[-Math.PI, 1.346, -Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ClayHouse001.geometry}
          material={materials.Clay}
          position={[-7.106, 0.885, 12.548]}
          rotation={[Math.PI, -1.511, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Thatched_roof001.geometry}
          material={materials.straw}
          position={[-7.106, 0.885, 12.548]}
          rotation={[Math.PI, -1.511, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1002.geometry}
          material={materials.wood1}
          position={[-7.106, 0.885, 12.548]}
          rotation={[Math.PI, -1.511, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1003.geometry}
          material={materials.wood1}
          position={[-7.106, 0.885, 12.548]}
          rotation={[Math.PI, -1.511, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood2002.geometry}
          material={materials.wood1}
          position={[-7.106, 0.885, 12.548]}
          rotation={[Math.PI, -1.511, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood3002.geometry}
          material={materials.wood1}
          position={[-7.106, 0.885, 12.548]}
          rotation={[Math.PI, -1.511, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood3006.geometry}
          material={materials.wood1}
          position={[6.068, 0.936, -3.567]}
          rotation={[0, 1.409, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood2006.geometry}
          material={materials.wood1}
          position={[6.068, 0.936, -3.567]}
          rotation={[0, 1.409, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1009.geometry}
          material={materials.wood1}
          position={[6.068, 0.936, -3.567]}
          rotation={[0, 1.409, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1010.geometry}
          material={materials.wood1}
          position={[6.068, 0.936, -3.567]}
          rotation={[0, 1.409, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Thatched_roof005.geometry}
          material={materials.straw}
          position={[6.068, 0.936, -3.567]}
          rotation={[0, 1.409, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ClayHouse005.geometry}
          material={materials.Clay}
          position={[6.068, 0.936, -3.567]}
          rotation={[0, 1.409, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood3003.geometry}
          material={materials.wood1}
          position={[0.09, 0.761, 7.203]}
          rotation={[Math.PI, -1.182, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood2003.geometry}
          material={materials.wood1}
          position={[0.09, 0.761, 7.203]}
          rotation={[Math.PI, -1.182, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1004.geometry}
          material={materials.wood1}
          position={[0.09, 0.761, 7.203]}
          rotation={[Math.PI, -1.182, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1005.geometry}
          material={materials.wood1}
          position={[0.09, 0.761, 7.203]}
          rotation={[Math.PI, -1.182, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Thatched_roof002.geometry}
          material={materials.straw}
          position={[0.09, 0.761, 7.203]}
          rotation={[Math.PI, -1.182, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ClayHouse002.geometry}
          material={materials.Clay}
          position={[0.09, 0.761, 7.203]}
          rotation={[0, -1.021, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood3005.geometry}
          material={materials.wood1}
          position={[-12.008, 0.936, -4.476]}
          rotation={[-Math.PI, 0.918, -Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood2005.geometry}
          material={materials.wood1}
          position={[-12.008, 0.936, -4.476]}
          rotation={[-Math.PI, 0.918, -Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1007.geometry}
          material={materials.wood1}
          position={[-12.008, 0.936, -4.476]}
          rotation={[-Math.PI, 0.918, -Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1008.geometry}
          material={materials.wood1}
          position={[-12.008, 0.936, -4.476]}
          rotation={[-Math.PI, 0.918, -Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Thatched_roof004.geometry}
          material={materials.straw}
          position={[-12.008, 0.936, -4.476]}
          rotation={[-Math.PI, 0.918, -Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ClayHouse004.geometry}
          material={materials.Clay}
          position={[-12.008, 0.936, -4.476]}
          rotation={[Math.PI, -0.02, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ClayHouse006.geometry}
          material={materials["Clay.001"]}
          position={[0.401, 0.737, 3.286]}
          rotation={[0, 0.634, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ClayHouse007.geometry}
          material={materials["Clay.002"]}
          position={[-7.876, 0.785, -15.146]}
          rotation={[0, 0.48, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ClayHouse008.geometry}
          material={materials["Clay.003"]}
          position={[-5.15, 0.877, -17.713]}
          rotation={[Math.PI, -0.02, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ClayHouse009.geometry}
          material={materials["Clay.004"]}
          position={[12.66, 0.928, -5.309]}
          rotation={[Math.PI, -0.262, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ClayHouse010.geometry}
          material={materials["Clay.005"]}
          position={[17.004, 0.863, -11.421]}
          rotation={[0, 0.159, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ClayHouse011.geometry}
          material={materials["Clay.006"]}
          position={[15.112, 0.937, -7.999]}
          rotation={[0, -0.119, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Grove2001.geometry}
          material={materials["Forest Ground.007"]}
          position={[12.039, 0.362, -11.435]}
          rotation={[-0.027, -0.451, -0.018]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Grove3001.geometry}
          material={materials["Forest Ground.007"]}
          position={[11.059, 0.343, -9.489]}
          rotation={[-0.021, -0.456, -0.015]}
        />
        <group
          position={[14.844, 0.847, -9.024]}
          rotation={[0.256, 1.009, -0.18]}
          scale={0.126}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.StickToolOne001_1.geometry}
            material={materials["Wood.001"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.StickToolOne001_2.geometry}
            material={materials["Steel.001"]}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Thatched_roof006.geometry}
          material={materials["straw.001"]}
          position={[0.401, 0.737, 3.286]}
          rotation={[0, -0.304, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Thatched_roof007.geometry}
          material={materials["straw.002"]}
          position={[-7.876, 0.785, -15.146]}
          rotation={[0, 0.48, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Thatched_roof008.geometry}
          material={materials["straw.003"]}
          position={[-5.15, 0.877, -17.713]}
          rotation={[-Math.PI, 0.918, -Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Thatched_roof009.geometry}
          material={materials["straw.004"]}
          position={[12.66, 0.928, -5.309]}
          rotation={[Math.PI, -0.262, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Thatched_roof010.geometry}
          material={materials["straw.005"]}
          position={[17.004, 0.863, -11.421]}
          rotation={[0, -0.779, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Thatched_roof011.geometry}
          material={materials["straw.006"]}
          position={[15.112, 0.937, -7.999]}
          rotation={[0, -1.057, 0]}
        />
        <group
          position={[13.168, 0.419, -9.656]}
          rotation={[0, -1.134, Math.PI / 2]}
          scale={0.171}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.ToolThree002_1.geometry}
            material={materials["Steel.001"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.ToolThree002_2.geometry}
            material={materials["Wood.001"]}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1011.geometry}
          material={materials["wood1.001"]}
          position={[0.401, 0.737, 3.286]}
          rotation={[0, -0.304, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1012.geometry}
          material={materials["wood1.001"]}
          position={[0.401, 0.737, 3.286]}
          rotation={[0, -0.304, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1013.geometry}
          material={materials["wood1.002"]}
          position={[-7.876, 0.785, -15.146]}
          rotation={[0, 0.48, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1014.geometry}
          material={materials["wood1.003"]}
          position={[-5.15, 0.877, -17.713]}
          rotation={[-Math.PI, 0.918, -Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1015.geometry}
          material={materials["wood1.003"]}
          position={[-5.15, 0.877, -17.713]}
          rotation={[-Math.PI, 0.918, -Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1016.geometry}
          material={materials["wood1.004"]}
          position={[12.66, 0.928, -5.309]}
          rotation={[Math.PI, -0.262, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1017.geometry}
          material={materials["wood1.005"]}
          position={[17.004, 0.863, -11.421]}
          rotation={[0, -0.779, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1018.geometry}
          material={materials["wood1.005"]}
          position={[17.004, 0.863, -11.421]}
          rotation={[0, -0.779, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1019.geometry}
          material={materials["wood1.006"]}
          position={[15.112, 0.937, -7.999]}
          rotation={[0, -1.057, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood1020.geometry}
          material={materials["wood1.006"]}
          position={[15.112, 0.937, -7.999]}
          rotation={[0, -1.057, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood2007.geometry}
          material={materials["wood1.001"]}
          position={[0.401, 0.737, 3.286]}
          rotation={[0, -0.304, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood2008.geometry}
          material={materials["wood1.002"]}
          position={[-7.876, 0.785, -15.146]}
          rotation={[0, 0.48, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood2009.geometry}
          material={materials["wood1.003"]}
          position={[-5.15, 0.877, -17.713]}
          rotation={[-Math.PI, 0.918, -Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood2010.geometry}
          material={materials["wood1.004"]}
          position={[12.66, 0.928, -5.309]}
          rotation={[Math.PI, -0.262, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood2011.geometry}
          material={materials["wood1.005"]}
          position={[17.004, 0.863, -11.421]}
          rotation={[0, -0.779, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood2012.geometry}
          material={materials["wood1.006"]}
          position={[15.112, 0.937, -7.999]}
          rotation={[0, -1.057, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood3007.geometry}
          material={materials["wood1.001"]}
          position={[0.401, 0.737, 3.286]}
          rotation={[0, -0.304, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood3008.geometry}
          material={materials["wood1.002"]}
          position={[-7.876, 0.785, -15.146]}
          rotation={[0, 0.48, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood3009.geometry}
          material={materials["wood1.003"]}
          position={[-5.15, 0.877, -17.713]}
          rotation={[-Math.PI, 0.918, -Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood3010.geometry}
          material={materials["wood1.004"]}
          position={[12.66, 0.928, -5.309]}
          rotation={[Math.PI, -0.262, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood3011.geometry}
          material={materials["wood1.005"]}
          position={[17.004, 0.863, -11.421]}
          rotation={[0, -0.779, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wood3012.geometry}
          material={materials["wood1.006"]}
          position={[15.112, 0.937, -7.999]}
          rotation={[0, -1.057, 0]}
        />
        <group
          position={[0.729, 0.67, 6.358]}
          rotation={[0.137, 0.12, 0.022]}
          scale={0.126}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.StickToolOne_1.geometry}
            material={materials.Wood}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.StickToolOne_2.geometry}
            material={materials.Steel}
          />
        </group>
        <group
          position={[-11.291, 0.416, -5.834]}
          rotation={[1.59, -0.008, -0.477]}
          scale={0.203}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.StickToolTwo_1.geometry}
            material={materials.Wood}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.StickToolTwo_2.geometry}
            material={materials.Steel}
          />
        </group>
        <group
          position={[-2.322, 0.292, 6.605]}
          rotation={[0, -0.659, Math.PI / 2]}
          scale={0.171}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.ToolThree_1.geometry}
            material={materials.Steel}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.ToolThree_2.geometry}
            material={materials.Wood}
          />
        </group>
        <group
          position={[-9.651, 0.358, -8.961]}
          rotation={[Math.PI, 0.915, -Math.PI / 2]}
          scale={0.156}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.ToolThree001_1.geometry}
            material={materials.Steel}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.ToolThree001_2.geometry}
            material={materials.Wood}
          />
        </group>
    </group>
  );
}

useGLTF.preload("/Map_Muisca2.glb");
export default Village2;
