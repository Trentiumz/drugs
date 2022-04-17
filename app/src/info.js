import React from 'react';
import {useParams} from "react-router-dom";
import { useState } from 'react';
import MakeDINRequests from './api-calls/drugDatabase';
import Cookies from 'universal-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faBell, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'

export default function Information(din){
    //const {din} = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const cookies = new Cookies();
    if (loading) {
        MakeDINRequests(din).then(response => {
            setData(response);
        });
        setLoading(false);
    }

    function onClick() {
        let profile = cookies.get("profile");
        profile.medication.push({
            medication_name: data.brand_name,
            din: data.din,
            notes: data.descriptor,
            last_date_taken: parseInt(new Date().getDate())
        })
        cookies.set("profile", profile);
    }

    if (!data) {
        return (<div>Loading...</div>);
    } else {
        return(
            <div id="medication-info" className="rectangles">
                <div className="top-bar">
                  <div class="info-icons">
                    <a className="icon-buttons" href="/add">
                      <FontAwesomeIcon id="info-notif-icon" icon={faBell} />
                    </a>
                    <a className="icon-buttons" href="/add">
                      <FontAwesomeIcon id="info-tts-icon" icon={faVolumeHigh} />
                    </a>
                    <p className = "top-bar-title">{data.brand_name}</p>
                  </div>
                </div>
                <hr/>
                <div className="medication-info-body">
                  <div className="inner-medication-info-body">
                    <p className="info-item">Company:</p>
                    <p className="info-description">{data.company_name}</p>
                    <p className="info-item">Active Ingredients:</p>
                    <div className="info-description">{data.ingredients.map((el, key) => {
                        return (
                            <div key={key}>
                                <p className="info-description">{el.name} - Strength: {el.strength}</p>
                            </div>
                        )
                    })}</div>
                    <p className="info-item">Dosage Form:</p>
                    <p className="info-description">{data.form}</p>
                    <p className="info-item">Route of Administration:</p>
                    <p className="info-description">{data.route}</p>
                    <p className="info-item">Descriptor:</p>
                    <p className="info-description">{data.descriptor.length === 0 ? "N/A" : data.descriptor}</p>
                  </div>
                </div>
            </div>
        );
    }
}
