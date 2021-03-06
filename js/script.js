if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) { 
  var tempoID = document.getElementById("MB-tempo");
  var outputID = document.getElementById("output");
  tempoID.innerHTML = '<p class="MB-text" id="MB-tempo" style="color: darkred;">Tempo&nbsp;disabled [not compatible on Safari].&nbsp;</p>';
  $('#output').css('display', 'none');
} 

var currentPlayPauseIcon = 'play';
var allowChangePPIcon = 'false';
function changePlayPauseIcon() {
    var playpauseicon = document.getElementById("playpauseicon");

    if (currentPlayPauseIcon === 'play') {
        if (allowChangePPIcon === 'true') {
            $(playpauseicon).removeClass('fas fa-play').addClass('fas fa-pause');
            currentPlayPauseIcon = 'pause';
        }}
    
    else if (currentPlayPauseIcon === 'pause') {
        if (allowChangePPIcon === 'true') {
            $(playpauseicon).removeClass('fas fa-pause').addClass('fas fa-play');
            currentPlayPauseIcon = 'play';
        }}
}

var wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#fff',
  progressColor: '#ccc',
  barWidth: '1.5',
  cursorColor: '#fff',
  cursorWidth: '1',
  height: '200',
  plugins: 'Cursor',
  responsive: 'true'
});

var loadSong;
input.onchange = function(e){
    var sound = document.getElementById('sound');
    sound.src = URL.createObjectURL(this.files[0]);
    loadSong = sound.src = URL.createObjectURL(this.files[0]);
    wavesurfer.load(loadSong);
    var playpauseicon = document.getElementById("playpauseicon");
    if (currentPlayPauseIcon === 'pause') {
        $(playpauseicon).removeClass('fa fa-pause').addClass('fa fa-play');
        currentPlayPauseIcon = 'play';
    }
    sound.onend = function(e) {
      URL.revokeObjectURL(this.src);
    }

    var fileSize = this.files[0].size;
    var newFileSize;
    var fileBit = ' bytes ';
    if (fileSize > 1000) {
        newFileSize = fileSize/1024;
        fileBit = ' KB ';
    }
    if (fileSize > 100000) {
        newFileSize = fileSize/1024/1024;
        fileBit = ' MB ';
    }
    var roundedFileSize = Math.round(newFileSize);

    if (this.files[0].name.split('.').pop() === 'mp3' 
    || this.files[0].name.split('.').pop() === 'wav'
    || this.files[0].name.split('.').pop() === 'ogg'
    || this.files[0].name.split('.').pop() === 'm4a'
    || this.files[0].name.split('.').pop() === 'flac') {
        var output = [];
        output.push(escape(this.files[0].name), ' (', this.files[0].type || 'n/a', ') - ',
        roundedFileSize, fileBit);
        document.getElementById('list').innerHTML = output.join('');
    } else { 
        var output = [];
        output.push('<p style="color: #ea021d">Error [File must be accepted audio: mp3, wav, ogg, m4a, flac]</p>'); 
        document.getElementById('list').innerHTML = output.join('');}

    // tempo calculation
    var file = this.files[0];
    var reader = new FileReader();
    var context = new(window.AudioContext || window.webkitAudioContext)();
    reader.onload = function() {
      context.decodeAudioData(reader.result, function(buffer) {
        prepare(buffer);
      });
    };
    reader.readAsArrayBuffer(file);
  }

// Minified wavesurfer code
wavesurfer.on("ready",function(){var e=[{f:32,type:"lowshelf"},{f:64,type:"peaking"},{f:125,type:"peaking"},{f:250,type:"peaking"},{f:500,type:"peaking"},{f:1e3,type:"peaking"},{f:2e3,type:"peaking"},{f:4e3,type:"peaking"},{f:8e3,type:"peaking"},{f:16e3,type:"highshelf"}].map(function(e){var t=wavesurfer.backend.ac.createBiquadFilter();return t.type=e.type,t.gain.value=0,t.Q.value=1,t.frequency.value=e.f,t});wavesurfer.backend.setFilters(e);var t=document.querySelector("#equalizer");allowChangePPIcon = 'true';e.forEach(function(e){var a=document.createElement("input");wavesurfer.util.extend(a,{type:"range",min:-40,max:40,value:0,title:e.frequency.value}),a.style.display="inline-block",a.setAttribute("orient","vertical"),t.appendChild(a);var n=function(t){e.gain.value=~~t.target.value};a.addEventListener("input",n),a.addEventListener("change",n)}),wavesurfer.filters=e});
  
// Minified tempo code
function prepare(e){output.innerHTML = '<p style="color: #6598ed; display: inline-block">Calculating tempo..</p>';var t=new OfflineAudioContext(1,e.length,e.sampleRate),n=t.createBufferSource();n.buffer=e;var r=t.createBiquadFilter();r.type="lowpass",n.connect(r),r.connect(t.destination),n.start(0),t.startRendering(),t.oncomplete=function(e){process(e)}}
function process(e){output.innerHTML = '<p style="color: #ea021d; display: inline-block">Error [Could not calculate tempo: file has no tempo]</p>';var r=e.renderedBuffer.getChannelData(0),n=arrayMax(r),t=arrayMin(r),a=getPeaksAtThreshold(r,t+.98*(n-t)),o=countIntervalsBetweenNearbyPeaks(a),u=groupNeighborsByTempo(o);u.sort(function(e,r){return r.count-e.count}),u.length&&(output.innerHTML=u[0].tempo)}
function getPeaksAtThreshold(r,n){for(var t=[],o=r.length,e=0;e<o;)r[e]>n&&(t.push(e),e+=1e4),e++;return t}function countIntervalsBetweenNearbyPeaks(r){var n=[];return r.forEach(function(t,o){for(var e=0;e<10;e++){var u=r[o+e]-t,a=n.some(function(r){if(r.interval===u)return r.count++});isNaN(u)||0===u||a||n.push({interval:u,count:1})}}),n}function groupNeighborsByTempo(r){var n=[];return r.forEach(function(r){var t=60/(r.interval/44100);if(0!==(t=Math.round(t))){for(;t<90;)t*=2;for(;t>180;)t/=2;n.some(function(n){if(n.tempo===t)return n.count+=r.count})||n.push({tempo:t,count:r.count})}}),n}function arrayMin(r){for(var n=r.length,t=1/0;n--;)r[n]<t&&(t=r[n]);return t}function arrayMax(r){for(var n=r.length,t=-1/0;n--;)r[n]>t&&(t=r[n]);return t}

var volumeInput = document.querySelector('#volume');
    var onChangeVolume = function (e) {
      wavesurfer.setVolume(e.target.value);
      console.log(e.target.value);
    };
  volumeInput.addEventListener('input', onChangeVolume);
  volumeInput.addEventListener('change', onChangeVolume);

function showVolBox() { $('.volbox').css('display', 'inline-block'); }
function hideVolBox() { $('.volbox').css('display', 'none'); }

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function settingsDropdown() {
    document.getElementById("dropdownClass").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
