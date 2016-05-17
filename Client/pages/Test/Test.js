'use strict';

App.newPage({
  init: function(urlParams) {
    let page = new DocumentFragment();

    let div = page.add('div');
    App.dataHandler({
      dataName: 'TestData',
      specific: urlParams[0],
      action: function(data) {
        div.add('h3', {
          id: 'page-title',
          innerHTML: 'Test: ' + data.name
        });
        div.add('br');
        div.add('button', {
          id: 'add_new_segment',
          innerHTML: 'Add new segment'
        }).onclick = function() {
          App.navigate(`/NewSegment/${data.id}`);
        };
        div.add('p', {
          id: 'added_by',
          innerHTML: `Added by: ${data.added_by}`
        });
        div.add('p', {
          id: 'uploaded',
          innerHTML: `Added: ${parseDate(data.uploaded)}`
        });
        div.add('p', {
          id: 'last_modified',
          innerHTML: `Last Modified: ${parseDate(data.last_modified)}`
        });
        div.add('p', {
          id: 'segments_amount',
          innerHTML: `Amount of segments: ${data.segments_amount}`
        });
				let segmentsAvailable = false;
				if (data.segments_amount != '0') {
					segmentsAvailable = true;
				}
        if (segmentsAvailable) {
					div.addImg({
            id: 'frame',
            width: '800',
            height: '480',
            src: `/data/tests/${data.id}/frame.jpeg`
          }, 'scaleDown');
        } else {
					div.addImg({
            id: 'frame',
            width: '400',
            height: '250',
            src: '/data/imgs/error.gif'
          }, 'scaleDown');
        }
        div.add('h3', {
          id: 'page-title',
          innerHTML: 'Heat Map: '
        })
        let message = div.add('p', {
          id: 'message',
          innerHTML: ''
        })
        div.add('br');
        div.add('br');
        let button = div.add('button', {
					innerHTML: 'Calculate Heat Map'
				});
        message.style.display = 'none';
        div.add('br');
        let img = div.addImg({
            id: 'heat_map',
            width: '800',
            height: '480',
            src: `/data/tests/${data.id}/heat-map.png`
          },'remove')
				if (!segmentsAvailable){
					button.disabled = 'true';
				}
				button.onclick = function() {
          button.disabled = true;
					message.style.color = 'grey';
					message.style.display = 'initial';
					message.innerHTML = 'Generating heat map...'
					xhr_post({
						url: '/GenerateHeatMap',
						data: {
							testID: data.id
						},
						success: function(response) {
              button.disabled = false;
							let img = page.select('#heat_map');
							if (img) {
								img.remove();
							};
							div.addImg({
								id: 'heat_map',
								width: '800',
								height: '480',
								src: `/data/tests/${data.id}/heat-map.png`
							})
							message.style.color = 'green';
							message.style.display = 'initial';
							message.innerHTML = 'Heat map successfuly generated.'
							setTimeout(function(){
								message.style.display = 'none';
							}, 3000);
						}
					});
				}
      }
    })
    return page;
  }
})
