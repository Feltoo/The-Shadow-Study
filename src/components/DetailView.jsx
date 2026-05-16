import React from 'react';
import { useGameState } from '../context/GameStateContext';

// Import Room Components
import StudyClock from './rooms/StudyClock';
import StudyBookshelf from './rooms/StudyBookshelf';
import StudyBoard from './rooms/StudyBoard';
import StudyDesk from './rooms/StudyDesk';
import StudySafe from './rooms/StudySafe';
import StudyDoor from './rooms/StudyDoor';

import LabLocker from './rooms/LabLocker';
import LabWorkbench from './rooms/LabWorkbench';
import LabGenerator from './rooms/LabGenerator';
import LabVault from './rooms/LabVault';

import ArchiveCabinet from './rooms/ArchiveCabinet';
import ArchiveFusebox from './rooms/ArchiveFusebox';
import ArchiveMonitors from './rooms/ArchiveMonitors';
import ArchiveBlastdoor from './rooms/ArchiveBlastdoor';

import TunnelFancontrol from './rooms/TunnelFancontrol';
import TunnelTransformer from './rooms/TunnelTransformer';
import TunnelGrate from './rooms/TunnelGrate';
import TunnelHatch from './rooms/TunnelHatch';

const viewMap = {
    clock:      { title: 'Broken Clock',          Component: StudyClock },
    bookshelf:  { title: 'Bookshelf',             Component: StudyBookshelf },
    board:      { title: 'Investigation Board',   Component: StudyBoard },
    desk:       { title: 'Heavy Wooden Desk',     Component: StudyDesk },
    safe:       { title: 'Heavy Safe',            Component: StudySafe },
    door:       { title: 'Exit Door',             Component: StudyDoor },
    
    workbench:  { title: 'Mixing Station',        Component: LabWorkbench },
    locker:     { title: 'Hazmat Locker',         Component: LabLocker },
    generator:  { title: 'Rusty Generator',       Component: LabGenerator },
    vault:      { title: 'Vault Door',            Component: LabVault },
    
    cabinet:    { title: 'Filing Cabinet',        Component: ArchiveCabinet },
    fusebox:    { title: 'Fuse Box',              Component: ArchiveFusebox },
    monitors:   { title: 'Surveillance Monitors', Component: ArchiveMonitors },
    blastdoor:  { title: 'Blast Door',            Component: ArchiveBlastdoor },
    
    fancontrol: { title: 'Fan Control',           Component: TunnelFancontrol },
    transformer:{ title: 'Transformer',           Component: TunnelTransformer },
    grate:      { title: 'Metal Grate',           Component: TunnelGrate },
    hatch:      { title: 'Escape Hatch',          Component: TunnelHatch }
};

const DetailView = ({ target, onClose, onRoomChange }) => {
    const { addLog } = useGameState();
    const config = viewMap[target];

    // Log the inspection once when the component mounts, use a ref to prevent StrictMode double-firing
    const hasLogged = React.useRef(null);
    React.useEffect(() => {
        if (config && hasLogged.current !== target) {
            addLog(`You examine the ${config.title.toLowerCase()}.`);
            hasLogged.current = target;
        }
    }, [target, config, addLog]);

    if (!config) {
        return (
            <div id="detail-view" className="view active" style={{ display: 'flex' }}>
                <button id="back-btn" className="btn" onClick={onClose}>← Back to Room</button>
                <h2 id="detail-title">View</h2>
                <div id="detail-content"><p>Nothing of interest here.</p></div>
            </div>
        );
    }

    const { title, Component } = config;

    return (
        <div id="detail-view" className="view active" style={{ display: 'flex' }}>
            <button id="back-btn" className="btn" onClick={onClose}>← Back to Room</button>
            <h2 id="detail-title">{title}</h2>
            <div id="detail-content">
                <Component onRoomChange={onRoomChange} onClose={onClose} />
            </div>
        </div>
    );
};

export default DetailView;
