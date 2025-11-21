let stream = null; let currentImage = null;

async function startCamera(){
  const wrapper = document.getElementById('camera-wrapper');
  const video = document.getElementById('video');
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    wrapper.hidden = false;
  } catch(err){ alert('Camera not available. Use upload instead.'); }
}
function stopCamera(){
  document.getElementById('camera-wrapper').hidden = true;
  if(stream){ stream.getTracks().forEach(t=>t.stop()); stream=null; }
}

document.getElementById('start-camera').addEventListener('click', startCamera);
document.getElementById('stop-camera').addEventListener('click', stopCamera);
document.getElementById('snap').addEventListener('click', ()=>{
  const video = document.getElementById('video');
  const canvas = document.getElementById('result-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth; canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  currentImage = canvas.toDataURL('image/png');
  stopCamera();
});

document.getElementById('file-input').addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = ()=>{
    const canvas = document.getElementById('result-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width; canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    currentImage = canvas.toDataURL('image/png');
    URL.revokeObjectURL(url);
  };
  img.src = url;
});

document.getElementById('process').addEventListener('click', ()=>{
  if(!currentImage){ alert('Please take or upload a photo first.'); return; }
  const canvas = document.getElementById('result-canvas');
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
  // Basic color clustering placeholder
  // For now, just draw circles to simulate sock detection
  for(let i=0;i<5;i++){
    ctx.beginPath();
    ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, 30, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(255,0,0,0.6)';
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  alert('Pairs identified (simulation). Pattern toggle: ' + document.getElementById('pattern-toggle').checked);
});

document.getElementById('download').addEventListener('click', ()=>{
  const canvas = document.getElementById('result-canvas');
  const link = document.createElement('a');
  link.download = 'sock_pairs.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
