import { Component, OnInit } from '@angular/core';
import { VulnsService } from 'src/app/services/vulns.service';
import { HostsVulnsService } from 'src/app/services/hosts-vulns.service';
import { MissionsService } from 'src/app/services/missions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Locale } from 'src/app/storage/Locale';
import { ImpactsService } from 'src/app/services/impacts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MissionRouter } from 'src/app/router/MissionRouter';
import { ImpactModelApplication } from 'src/app/model/Impact';
import { VulnModelApplication } from 'src/app/model/Vuln';
import { HostsService } from 'src/app/services/hosts.service';
import { HostModelApplication } from 'src/app/model/Host';
import { VulnRouter } from 'src/app/router/VulnRouter';

@Component({
  selector: 'app-add-vulns-to-host-external',
  templateUrl: './add-vulns-to-host-external.component.html',
  styleUrls: ['./add-vulns-to-host-external.component.scss'],
})
export class AddVulnsToHostExternalComponent implements OnInit {
  public vulns = [];
  public impacts = [];
  public selectedVuln: string | null = null;
  public selectedImpact: string | null = null;
  public currentStateUser = '';
  public host: HostModelApplication;
  public durationInSeconds = 4;
  public missionId: string;

  constructor(
    private vulnsService: VulnsService,
    private hostsService: HostsService,
    private hostVulnsService: HostsVulnsService,
    private activatedRoute: ActivatedRoute,
    private impactService: ImpactsService,
    private _snackBar: MatSnackBar,
    private missionServices: MissionsService,
    private router: Router
  ) {}

  openSnackBar(message: string): void {
    this._snackBar.open(message, '', {
      duration: this.durationInSeconds * 1000,
    });
  }

  ngOnInit(): void {
    this.missionId = this.activatedRoute.snapshot.params.id;
    this.hostsService
      .getDataById(this.activatedRoute.snapshot.params.targetHost)
      .subscribe((host) => (this.host = host));
    this.loadVulns();
    this.loadImpact();
  }

  // get all vulns
  loadVulns(): void {
    this.vulnsService
      .getData()
      .then(({ data }: { count: number; data: VulnModelApplication[] }) => {
        const locale = new Locale().get();
        this.vulns = data.map((e) => ({
          name: e.translations[locale.toString()].name,
          value: e['@id'],
        }));
      });
  }

  loadImpact(): void {
    this.impactService
      .getData()
      .then(({ data }: { count: number; data: ImpactModelApplication[] }) => {
        this.impacts = data.map((e) => {
          return {
            name: e.name,
            value: e['@id'],
          };
        });
      });
  }

  onSubmit(form: NgForm): void {
    this.hostVulnsService
      .insert({
        ...form.value,
        vuln: this.selectedVuln,
        host: this.host['@id'],
        impact: this.selectedImpact,
        currentState: this.currentStateUser,
      })
      .subscribe(
        () => {
          this.openSnackBar('vulnerabilitie added');
          this.router.navigateByUrl(
            MissionRouter.redirectToShow(this.missionId)
          );
        },
        (err) => {
          this.openSnackBar('Error : ' + err.error['hydra:description']);
        }
      );
  }

  Vulns(value: string): void {
    this.selectedVuln = value;
  }

  Impacts(value: string): void {
    this.selectedImpact = value;
  }
  createVuln(): void {
    this.router.navigateByUrl(VulnRouter.redirectToCreate());
  }
}
