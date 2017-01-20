import {Component} from '@angular/core';

import {NavController} from 'ionic-angular';

import {MediaPlugin} from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public navCtrl:NavController) {
  }

  audioTypes = [
    {name: 'm4a'},
    {name: 'wav'},
    {name: 'mp3'},
    {name: 'ogg'},
    {name: 'opus.ogg'},
    {name: 'flac'}
  ];

  reload() {
    location.reload();
  }

  playMedia(item, e) {
    if (item.media) {
      item.media.stop();
      item.media.release();
      item.media = null;
      item.mediaStart = 0;
      return;
    }
    var audioEl = e.target.parentNode.querySelector('audio');
    item.media = new MediaPlugin(audioEl.src, ()=>{});
    item.media.play();
    item.mediaStart = +new Date();
    item.mediaTimeout = '';

    var timer = function () {
      setTimeout(() => {
        item.media.getCurrentPosition().then(c => {
          if (c > 0) {
            let d:any = new Date();
            item.mediaTimeout = d - item.mediaStart;
          } else {
            timer();
          }
        });
      }, 50);
    };
    timer();
  }

  onPlayStateChange(item, e) {
    if (e.type === 'play') {
      item.start = +new Date();
      item.audioTimeout = '';
    } else if (!item.audioTimeout) {
      let d:any = new Date();
      item.audioTimeout = d - item.start;
    }
  }

  onPauseReset(item, e) {
    var audioEl = e.target;
    var oldSrc = audioEl.src;
    audioEl.src = ' ';
    audioEl.load();
    setTimeout(function () {
      audioEl.src = oldSrc;
    })
  }

  playAndChangeCurrentTime(e) {
    var audioEl = e.target.parentNode.querySelector('audio');
    audioEl.play();
    audioEl.currentTime = 2800;
  }

}
