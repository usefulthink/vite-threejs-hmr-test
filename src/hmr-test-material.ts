import { RawShaderMaterial } from "three";

export class HmrTestMaterial extends RawShaderMaterial {
  isHmrTestMaterial = true;
  vertexShader = `
    precision highp float;
      
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    
    attribute vec3 position;
    attribute vec2 uv;

    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
    }
  `;

  fragmentShader = `
    precision highp float;
      
    varying vec2 vUv;

    void main() {
      gl_FragColor = vec4(vUv.x, vUv.y + 0.2, 1.0, 1.0);
    }
  `;
}
