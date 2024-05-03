import React, { useState } from 'react'
import { metaData } from '@cornerstonejs/core'
import { Icon } from '@ohif/ui'

window.overlaysState = {}

function OverlaySidepanel({ servicesManager }) {
  console.log(servicesManager)
  const imageIds = servicesManager.services.CornerstoneViewportService.viewportsById.get("default").viewportData.data.imageIds
  const overlays = metaData.get('overlayPlaneModule', imageIds[0])?.overlays

  if (!overlays) {
    return null
  }

  const rerender = () => {
    const service = servicesManager.services.viewportGridService
    service._broadcastEvent(service.EVENTS.GRID_SIZE_CHANGED)
  }

  for (let overlay of overlays) {
    if (!window.overlaysState[overlay.label]) {
      window.overlaysState[overlay.label] = {
        show: true
      }
    }
  }

  return (
    <div id="flex min-h-0 flex-col bg-black text-[13px] font-[300]">
      <div
        className="bg-secondary-dark mt-[2px] flex h-7 select-none items-center rounded-[4px] pl-2.5 text-[13px]">
        <div className="text-aqua-pale">Overlay skupiny</div>
      </div>
      <div className="h-[2px] bg-black"></div>
      {
        overlays.map((overlay, i) => (
          <OverlayRow overlay={overlay} key={i+1} i={i} rerender={rerender}/>
        ))
      }
    </div>
  )
}

function OverlayRow({ i, overlay, rerender }) {
  const [show, setShow] = useState(true)

  const onToggle = () => {
    window.overlaysState[overlay.label].show = !show
    setShow(!show)
    rerender()
  }

  const c = overlay.roiColor

  return (
    <div className="mb-[1px] overflow-hidden">
      <div className="flex min-h-[28px]">
        <div className="grid w-[28px] place-items-center bg-primary-dark">
          <div className="text-aqua-pale text-[13px] font-[300] select-none">{++i}</div>
        </div>
        <div className="relative flex w-full h-full flex-grow items-center bg-primary-dark">
          <div className="ml-2 mr-1.5 h-[8px] w-[8px] grow-0 rounded-full"
               style={{"backgroundColor": "rgb(" + [c[0], c[1], c[2]].join(", ") + ")"}}></div>
          <div className="py-1 text-[13px] font-[300] text-aqua-pale capitalize">{overlay.label}</div>
          <div className="absolute right-[8px] top-[3px]">
            <div
              className="text-white cursor-pointer"
              onClick={onToggle}
            >
              <Icon name={show ? "row-shown" : "row-hidden"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverlaySidepanel
