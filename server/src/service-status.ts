import { randomInt } from "crypto";
import { Router, type Request, type Response } from "express";
import util from 'node:util';
import { exec as execCallback } from 'node:child_process';

export const serviceStatusRouter = Router()

type stateTypes =  "ok" | "problem" | "critical-problem"

type serviceRecord = {
    name: string,
    uptime: string | undefined,
    state: string,
    stateType: stateTypes
}

type serivesStatusResponse = {
    services: serviceRecord[],
    message ?: string
}

async function getServicesStatus(req : Request, res : Response) {
    const exec = util.promisify(execCallback);

    const services = [
        "reactor-database-export.service",
        "reactor-api-server.service",
        "reactor-core-module.service",
        "avahi-daemon.service",
        "avahi-daemon.socket"
    ];
    let serviceStats : serviceRecord[] = [];
    let response : serivesStatusResponse

    function categorizeState(state: string) : stateTypes{
        switch(state){
            case "active":
                return "ok"
            case "not installed":
            case "failed":
            case "inactive":
                return "critical-problem"
            default:
                return "problem"
        }
    }

    if (process.platform == "linux") {
        for (let service of services) {
            let out = {
                stdout: "",
                stderr: ""
            };
            try {
                const command = "systemctl status " + service + " | grep Active | awk -F \";\" '{print $2}' | sed 's/ ago//'";
                out = await exec(command);
            } catch (error) {
                serviceStats.push({
                    name: service,
                    uptime: undefined,
                    state: "not installed",
                    stateType: categorizeState("not installed")
                })
                continue;
            }

            let uptime: string | undefined = out.stdout;
            if (uptime.includes(service) || uptime === "") {
                uptime = undefined;
            }


            try {
                out = await exec("systemctl show " + service + " --property='ActiveState' | awk -F= '{print $2}'")
            } catch (error) {
                serviceStats.push({
                    name: service,
                    uptime: undefined,
                    state: "not installed",
                    stateType: categorizeState("not installed")
                })
                continue;
            }
            let state =  out.stdout.trim();

            serviceStats.push({
                name: service,
                uptime: uptime,
                state: state,
                stateType: categorizeState(state)
            })
        }

        response = {
            services: serviceStats
        }

    } else {//just for debugging purposses
        for (let service of services) {
            let state = ["active","inactive","activating"][randomInt(3)] ?? "unknown"
            serviceStats.push({
                name: service,
                uptime:  randomInt(60) + "min " + randomInt(60) + "s",
                state: state,
                stateType: categorizeState(state)
            })
        }

        response = {
            services: serviceStats,
            message: "invalid values, only used for debug!!"
        }
    }

    res.status(200).send(JSON.stringify(response));
    
}


serviceStatusRouter.get('/', getServicesStatus);
            