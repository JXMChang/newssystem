import React from 'react'
import style from './Child.module.scss'
export default function Child() {
  return (
    <div>
      child
      <ul>
        <li className={style.item}>
          111
        </li>
        <li className={style.item}>
          111
        </li>
       </ul>
    </div>
  )
}
