<template>
  <v-tabs v-model="tab" class="options-view">
    <v-tabs-slider />
    <v-tab href="#tab1">image</v-tab>
    <v-tab href="#tab2">Blocked domains</v-tab>
    <v-tab href="#tab3">Blocked pages</v-tab>

    <v-tab-item value="tab1">
      <v-container>
        <v-row no-gutters>
          <v-col class="body-1">
            ブロック中のタブに表示する画像を指定します。
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-file-input v-model="file" clearable dense hide-details />
          </v-col>
          <v-col cols="auto">
            <v-btn text @click="save">save</v-btn>
          </v-col>
        </v-row>
        <v-row no-gutters justify="center">
          <v-col v-if="image" cols="auto">
            <img class="options-view__image" :src="image" />
          </v-col>
        </v-row>
      </v-container>
      <!-- remove image confirm dialog -->
      <v-dialog v-model="confirm" hide-overlay max-width="300">
        <v-card>
          <v-card-title>Confirm</v-card-title>
          <v-card-text>画像を削除します。</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="confirm = false">no</v-btn>
            <v-btn text @click="removeImage">ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-tab-item>

    <v-tab-item value="tab2">
      <v-container>
        <v-row no-gutters>
          <v-col>
            <v-list v-if="blockedDomains.length > 0" dense>
              <template v-for="(domain, i) in blockedDomains">
                <v-list-item :key="i">
                  <v-list-item-content class="body-1">
                    {{ domain }}
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      text
                      :disabled="running"
                      @click="removeBlockDomain(domain)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>

                <v-divider :key="i" />
              </template>
            </v-list>

            <div v-else class="title">
              ブロック中のサイトはありません。
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-tab-item>

    <v-tab-item value="tab3">
      <v-container>
        <v-row no-gutters>
          <v-col>
            <v-list v-if="blockedPages.length > 0" dense>
              <template v-for="(page, i) in blockedPages">
                <v-list-item :key="i">
                  <v-list-item-content class="body-1">
                    {{ page }}
                  </v-list-item-content>
                  <v-list-item-action v-if="!running">
                    <v-btn
                      text
                      :disabled="running"
                      @click="removeBlockPage(page)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>

                <v-divider :key="i" />
              </template>
            </v-list>

            <div v-else class="title">
              ブロック中のページはありません。
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import moment from 'moment'

import { Component, Vue } from 'vue-property-decorator'

import { optionsService } from '@/services/options-service'

@Component
export default class OptionsView extends Vue {
  tab: number = 0
  file?: File
  confirm: boolean = false

  get running(): boolean {
    return moment().isBefore(this.concentrateTime)
  }
  get concentrateTime(): moment.Moment {
    return moment.unix(this.$store.concentrateTime ?? 0)
  }
  set image(value: string | undefined) {
    this.$store.image = value
  }
  get image(): string | undefined {
    return this.$store.image
  }
  set blockedDomains(value: string[]) {
    this.$store.blockedDomains = value
  }
  get blockedDomains(): string[] {
    return this.$store.blockedDomains
  }
  set blockedPages(value: string[]) {
    this.$store.blockedPages = value
  }
  get blockedPages(): string[] {
    return this.$store.blockedPages
  }

  async save() {
    if (this.file) {
      if (optionsService.validImageFile(this.file)) {
        await this.saveImage(this.file)
      }
    } else if (this.image) {
      this.confirm = true
    }
  }

  async saveImage(file: File) {
    this.image = await optionsService.toBase64(file)
  }

  removeImage() {
    this.image = undefined
    this.confirm = false
  }

  removeBlockDomain(domain: string): void {
    this.blockedDomains = this.blockedDomains.filter(x => x !== domain)
  }

  removeBlockPage(page: string): void {
    this.blockedPages = this.blockedPages.filter(x => x !== page)
  }
}
</script>

<style lang="scss" scoped>
.options-view {
  min-width: 680px;
  max-width: 680px;

  &__image {
    max-width: 100%;
    object-fit: cover;
  }
}
</style>
