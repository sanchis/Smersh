import { AbstractResource } from 'src/app/resources/AbstractResource';
import { VulnsListComponent } from 'src/app/components/vulns/vulnsList.component';
import { VulnsEditComponent } from 'src/app/components/vulns-edit/vulns-edit.component';
import { VulnsCreateComponent } from 'src/app/components/vulns-create/vulns-create.component';

export class VulnResource extends AbstractResource {
  protected basePath = 'vulnerabilities';
  protected list = VulnsListComponent;
  protected edit = VulnsEditComponent;
  protected create = VulnsCreateComponent;
}
