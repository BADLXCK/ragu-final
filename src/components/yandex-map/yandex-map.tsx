'use client';

import React from 'react';
import styles from './yandex-map.module.scss';
import { YMaps, Map, Placemark } from '@iminside/react-yandex-maps';


export const YandexMap = ({ className }: { className?: string }) => {
    const defaultState = {
        center: [59.943787, 30.288325],
        zoom: 18,
        controls: ["zoomControl"],
    }

    const modules = ["control.ZoomControl"];

    return (
        <div className={className}>
            <YMaps>
                <Map defaultState={defaultState} modules={modules} className={styles.map}>
                    <Placemark
                        defaultGeometry={defaultState.center}
                    />
                </Map>
            </YMaps>
        </div>
    );
}