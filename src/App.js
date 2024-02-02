import * as THREE from 'three'
import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Image, ScrollControls, Scroll, useScroll, Html } from '@react-three/drei'
import { proxy, useSnapshot } from 'valtio'
import { easing } from 'maath'
import tmdb from './api/tmdb';

import { usePlay } from "./contexts/Play";

import { Overlay } from './Components/Overlay'

const material = new THREE.LineBasicMaterial({ color: 'white' })
const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, 0.5, 0)])
export const state = proxy({
  clicked: null,
  // urls: [1, 2].map((u) => `/${u}.png`)
  urls: [],
  title: [],
  overview: [],
  release_date: [],
  vote_average: [],
  pages: [],
  page: 1
})

function Minimap() {
  const ref = useRef()
  const scroll = useScroll()
  const { urls } = useSnapshot(state)
  const { height } = useThree((state) => state.viewport)
  useFrame((state, delta) => {
    ref.current.children.forEach((child, index) => {
      // Give me a value between 0 and 1
      //   starting at the position of my item
      //   ranging across 4 / total length
      //   make it a sine, so the value goes from 0 to 1 to 0.
      const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length)
      easing.damp(child.scale, 'y', 0.15 + y / 6, 0.15, delta)
    })
  })
  return (
    <group ref={ref}>
      {urls.map((_, i) => (
        <line key={i} geometry={geometry} material={material} position={[i * 0.06 - urls.length * 0.03, -height / 2 + 0.6, 0]} />
      ))}
    </group>
  )
}

function Item({ index, position, scale, ...props }) {
  const ref = useRef()
  const scroll = useScroll()
  const { clicked, urls } = useSnapshot(state)
  const [hovered, hover] = useState(false)
  // const [isModalVisible, setModalVisible] = useState(false);
  const { isModalVisible, setModalVisible } = usePlay();

  
  // const click = () => (state.clicked = index === clicked ? null : index)
  const click = () => {
    if (index === clicked) {
      setModalVisible(!isModalVisible); // Toggle modal visibility
    } else {
      state.clicked = index; // Select the item if it's not already selected
    }
  };

  const over = () => hover(true)
  const out = () => hover(false)


  useFrame((state, delta) => {
    const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length)
    easing.damp3(ref.current.scale, [clicked === index ? 4.7 : scale[0], clicked === index ? 5 : 4 + y, 1], 0.15, delta)
    ref.current.material.scale[0] = ref.current.scale.x
    ref.current.material.scale[1] = ref.current.scale.y
    if (clicked !== null && index < clicked) easing.damp(ref.current.position, 'x', position[0] - 2, 0.15, delta)
    if (clicked !== null && index > clicked) easing.damp(ref.current.position, 'x', position[0] + 2, 0.15, delta)
    if (clicked === null || clicked === index) easing.damp(ref.current.position, 'x', position[0], 0.15, delta)
    // if (clicked === index) console.log(index)
    easing.damp(ref.current.material, 'grayscale', hovered || clicked === index ? 0 : Math.max(0, 1 - y), 0.15, delta)
    easing.dampC(ref.current.material.color, hovered || clicked === index ? 'white' : '#aaa', hovered ? 0.3 : 0.15, delta)
  })
  return (<>
    <Image ref={ref} {...props} position={position} scale={scale} onClick={click} onPointerOver={over} onPointerOut={out} />
  </>
  )
}

function Items({ w = 1.5, gap = 0.15 }) {
  const { urls } = useSnapshot(state)
  const { width } = useThree((state) => state.viewport)
  const xW = w + gap
  return (
    <ScrollControls horizontal damping={0.1} pages={(width - xW + urls.length * xW) / width}>
      <Minimap />
      <Scroll>
        {urls.map((url, i) => <Item key={i} index={i} position={[i * xW, 0, 0]} scale={[w, 4, 1]} url={url} />) /* prettier-ignore */}
      </Scroll>
    </ScrollControls>
  )
}



export const App = () => {
  // Fetch movies and update urls in state
  const { page } = useSnapshot(state)

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await tmdb.get("movie/top_rated?page=" + page);
      // Update state.urls with movie poster paths
      state.urls = data.results.map(movie =>
        'https://image.tmdb.org/t/p/w440_and_h660_face' + movie.poster_path);
      state.title = data.results.map(movie => movie.title);
      state.overview = data.results.map(movie => movie.overview);
      state.release_date = data.results.map(movie => movie.release_date);
      state.vote_average = data.results.map(movie => movie.vote_average);
      state.pages = data.results.map(movie =>
        'https://www.themoviedb.org/movie/' + movie.id);
      // console.log(page)
      };
    fetchMovies();
  }, [page]);
  return (
    <>
    
    <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} onPointerMissed={() => (state.clicked = null)}>
      <Items />
    </Canvas>
    <Overlay/>
    </>
  );
};
