let FS = `#version 300 es
precision highp float;
uniform vec2 R;
uniform float T,K;
out vec4 O;
float m,P,A;
mat2 r(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float B(vec3 p,float b,float e){
  p=abs(p)-b;vec3 q=abs(p+e)-e;
  return min(min(length(max(vec3(p.x,q.y,q.z),0.))+min(max(p.x,max(q.y,q.z)),0.),length(max(vec3(q.x,p.y,q.z),0.))+min(max(q.x,max(p.y,q.z)),0.)),length(max(vec3(q.x,q.y,p.z),0.))+min(max(q.x,max(q.y,p.z)),0.));
}
float D(vec3 p){
  float d=p.y-.7,e;
  vec3 q=p-vec3(0,3.4,0),u=q;
  m=3.;
  e=length(q)-2.6;
  if(e>1.)return min(d,e+.05);
  u.xz*=r(P*3.2);u.xy*=r(P*-3.08);
  e=B(u,1.45,.035);
  u=q;u.yz*=r(P*6.22);u.xz*=r(P*-3.2);
  e=min(e,B(u,.9,.026));
  u=q;u.xy*=r(P*9.48);u.yz*=r(P*6.34);
  e=min(e,B(u,.5,.016));
  if(e<d){d=e;m=1.;}
  e=length(q)-.3-.012*A;
  if(e<d){d=e;m=2.;}
  return d;
}
void main(){
  P=smoothstep(2.,60.,T);
  A=.5-.5*cos(T*.6283);
  float t,d,h,i,g,a,s,C=0.;
  vec3 l=normalize(vec3(sin(T*.08)*.8,1,cos(T*.08)*.8)),F=vec3(0,3.4-.9*P,0),o,f,x,y,w,p,n;
  vec2 e=vec2(.001,-.001),k;
  for(int b=0;b<3;b++){
    k=(gl_FragCoord.xy+vec2(b,(b*2)%3)/3.-.33-.5*R)/min(R.x,R.y);
    o=vec3(.55,.28,.79)*3.*pow(4.8,P);o.xz*=r(.9*P-.9);o.y+=A*.06*pow(4.8,P);o+=F;
    f=normalize(F-o);x=normalize(cross(f,vec3(0,1,0)));y=cross(x,f);w=normalize(f*mix(4.5,2.1,P)+k.x*x+k.y*y);
    g=1.;a=0.;s=0.;
    for(int v=0;v<3;v++){
      t=0.;
      for(i=0.;i<140.&&t<80.;i++){d=D(o+w*t);if(d<4e-4)break;t+=d;}
      p=o+w*t;D(p);h=m;
      n=normalize(e.xyy*D(p+e.xyy)+e.yyx*D(p+e.yyx)+e.yxy*D(p+e.yxy)+e.xxx*D(p+e.xxx));
      if(t>79.){h=0.;break;}
      if(h<2.)break;
      if(h>2.){d=.25*exp(-.12*length(p.xz));a+=g*.94*(1.-d);g*=d;}
      else{
        s=1.;g*=.2+.75*pow(1.+dot(w,n),5.);a+=pow(max(dot(reflect(w,n),l),0.),90.)*(.5+A);}
      w=reflect(w,n);o=p+n*.01;
    }
    C+=a+g*(h>0.?.03+.2*pow(1.+dot(w,n),4.)+.3*pow(max(dot(reflect(w,n),l),0.),20.):.94);
  }
  O=vec4(mix(vec3(C*.333*(.97+.05*A-(.35-.25*A)*dot(k,k))+(fract(sin(dot(gl_FragCoord.xy+T,vec2(12.9898,78.233)))*43758.5453)-.5)*.035)*K,vec3(1),smoothstep(56.,62.,T)),1);
}`;

let G = c.getContext('webgl2'), P = G.createProgram(), Q = 44100, L = 64, N = Q * L, W = Math, U, t0;

[[35633, '#version 300 es\nvoid main(){gl_Position=vec4(vec2(gl_VertexID&1,gl_VertexID>>1)*4.-1.,0,1);}'], [35632, FS]].map(([k, s]) => {
  let x = G.createShader(k);
  G.shaderSource(x, s);
  G.compileShader(x);
  G.attachShader(P, x);
});
G.linkProgram(P);
G.useProgram(P);

let sm = (a, b, x) => (x = W.min(W.max((x - a) / (b - a), 0), 1)) * x * (3 - 2 * x),
  u = (n, v) => G.uniform1f(G.getUniformLocation(P, n), v);

let S = 1, Z = 0, frame = () => {
  let t = U.currentTime - t0;
  if (t < 6 && t - Z > .03 && S > .5) S *= .85;
  Z = t;
  if (c.width != (innerWidth * S | 0) || c.height != (innerHeight * S | 0)) c.width = innerWidth * S, c.height = innerHeight * S;
  G.viewport(0, 0, c.width, c.height);
  G.uniform2f(G.getUniformLocation(P, 'R'), c.width, c.height);
  u('T', t);
  u('K', sm(2, 8, t));
  G.drawArrays(4, 0, 3);
  d.style.opacity = sm(1, 0, t);
  if (t > L && document.fullscreenElement) document.exitFullscreen();
  requestAnimationFrame(frame);
};

onclick = () => {
  if (U) return;
  U = new AudioContext;
  let b = U.createBuffer(2, N, Q), X = b.getChannelData(0), Y = b.getChannelData(1), T = 2 * W.PI,
    C = [[98, 146.83, 246.94, 369.99], [123.47, 185, 293.66, 440], [110, 164.81, 246.94, 329.63], [73.42, 146.83, 220, 369.99]],
    D = Q * .75 | 0, E = Q / 2 | 0, i, t, j, c, w, x, y, v, f, o, pf = 0, pp = .5, pt = -9;
  for (i = 0; i < N; i++) {
    t = i / Q;
    x = y = 0;
    c = W.min(t / 16 | 0, 3);
    w = sm(0, 6, t - c * 16);
    o = (.5 - .5 * W.cos(T * t / 10)) * .5 + .5;
    for (j = 0; j < 8; j++) {
      f = C[j < 4 ? c : W.max(c - 1, 0)][j & 3];
      v = (j < 4 ? w : 1 - w) * [.07, .05, .04, .03][j & 3] * o * sm(0, 10, t);
      x += v * W.sin(T * f * t);
      y += v * W.sin(T * f * 1.002 * t + j);
    }
    if (i % E == 0 && t - pt > 2 && W.random() < .25 * sm(6, 12, t) * sm(58, 52, t))
      pt = t, pf = C[c][1 + W.random() * 3 | 0] * (W.random() < .5 ? 2 : 4), pp = W.random();
    o = t - pt;
    v = (W.sin(T * pf * o) + .15 * W.sin(2 * T * pf * o)) * W.min(o * 15, 1) * W.exp(-o * .9) * .06;
    x += v * (1 - pp);
    y += v * pp;
    o = t % 16;
    v = W.sin(T * C[c][0] * .5 * t) * W.min(o, 1) * W.exp(-o * .25) * .12;
    x += v;
    y += v;
    for (j of [1103, 1597, 2311, 3203]) if (i > j + 97) x += X[i - j] * .03, y += Y[i - j - 97] * .03;
    if (i > D) x += Y[i - D] * .38;
    if (i > E) y += X[i - E] * .38;
    X[i] = W.tanh(x * 1.8) * sm(L, L - 6, t);
    Y[i] = W.tanh(y * 1.8) * sm(L, L - 6, t);
  }
  x = U.createBufferSource();
  x.buffer = b;
  x.connect(U.destination);
  x.start();
  t0 = U.currentTime;
  document.body.requestFullscreen?.();
  frame();
};
