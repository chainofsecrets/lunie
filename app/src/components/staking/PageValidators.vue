<template>
  <TmPage :managed="true" hide-header>
    <div
      v-if="$apollo.queries.validators.loading && !validators.length && !loaded"
      class="loading-image-container"
    >
      <img
        class="loading-image"
        src="/img/validator-list-loading.svg"
        alt="geometric placeholder shapes"
      />
    </div>
    <template v-else slot="managed-body">
      <div class="filterOptions">
        <TmField
          v-model="searchTerm"
          class="searchField"
          placeholder="Search"
        />
        <div class="toggles">
          <TmBtn
            value="Popular"
            class="btn-radio secondary"
            :type="popularSort ? `active` : `secondary`"
            @click.native="defaultSelectorsController(`popularSort`)"
          />
          <TmBtn
            value="All"
            class="btn-radio secondary"
            :type="allValidators ? `active` : `secondary`"
            @click.native="defaultSelectorsController(`allValidators`)"
          />
          <TmBtn
            value="Active"
            class="btn-radio secondary"
            :type="activeOnly ? `active` : `secondary`"
            @click.native="defaultSelectorsController(`activeOnly`)"
          />
        </div>
      </div>
      <TableValidators
        :validators="validators"
        :delegations="delegations"
        show-on-mobile="expectedReturns"
      />
      <div
        v-if="validators && validators.length === 0 && searchTerm"
        class="no-results"
      >
        No results for these search terms
      </div>
    </template>
  </TmPage>
</template>

<script>
import { mapGetters } from "vuex"
import TableValidators from "staking/TableValidators"
import TmPage from "common/TmPage"
import TmField from "common/TmField"
import TmBtn from "common/TmBtn"
import gql from "graphql-tag"

export default {
  name: `tab-validators`,
  components: {
    TableValidators,
    TmPage,
    TmField,
    TmBtn,
  },
  data: () => ({
    searchTerm: "",
    activeOnly: false,
    allValidators: false,
    popularSort: true,
    validators: [],
    loaded: false,
  }),
  computed: {
    ...mapGetters([`address`, `network`]),
    validatorsPlus() {
      return this.validators.map((validator) => ({
        ...validator,
        smallName: validator.name ? validator.name.toLowerCase() : "",
      }))
    },
  },
  methods: {
    defaultSelectorsController(selector) {
      this.popularSort = false
      this.allValidators = false
      this.activeOnly = false

      if (selector === `popularSort`) {
        this.popularSort = true
      }
      if (selector === `allValidators`) {
        this.allValidators = true
      }
      if (selector === `activeOnly`) {
        this.activeOnly = true
      }
    },
  },
  apollo: {
    validators: {
      query: gql`
        query validators(
          $networkId: String!
          $searchTerm: String
          $activeOnly: Boolean
          $popularSort: Boolean
        ) {
          validators(
            networkId: $networkId
            searchTerm: $searchTerm
            activeOnly: $activeOnly
            popularSort: $popularSort
          ) {
            name
            operatorAddress
            consensusPubkey
            votingPower
            status
            statusDetailed
            picture
            expectedReturns
            popularity
          }
        }
      `,
      variables() {
        return {
          networkId: this.network,
          activeOnly: this.activeOnly,
          searchTerm: this.searchTerm,
          popularSort: this.popularSort,
        }
      },
      update: function (result) {
        this.loaded = true
        return Array.isArray(result.validators) ? result.validators : []
      },
    },
    delegations: {
      query: gql`
        query Delegations($networkId: String!, $delegatorAddress: String!) {
          delegations(
            networkId: $networkId
            delegatorAddress: $delegatorAddress
          ) {
            amount
            validator {
              operatorAddress
            }
          }
        }
      `,
      skip() {
        return !this.address
      },
      variables() {
        return {
          networkId: this.network,
          delegatorAddress: this.address,
        }
      },
      update(data) {
        /* istanbul ignore next */
        return data.delegations
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.loading-image-container {
  padding: 2rem;
}

.filterOptions {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  margin: 0.5rem 1rem;
  flex-direction: column-reverse;

  .toggles {
    margin-top: 0;
    margin-bottom: 1rem;
    display: inline-flex;
  }

  label {
    cursor: pointer;
  }

  input {
    font-size: 14px;
  }
}

.filterOptions .btn-radio {
  border-radius: 0;
}

.filterOptions .btn-radio:last-child {
  border-radius: 0 0.5rem 0.5rem 0;
  margin-left: -1px;
}

.filterOptions .btn-radio:first-child {
  border-radius: 0.5rem 0 0 0.5rem;
  margin-right: -1px;
}

@media screen and (min-width: 768px) {
  .filterOptions {
    justify-content: space-between;
    flex-direction: row;
    margin: 0.5rem 2rem 1rem;

    .toggles {
      margin-bottom: 0;
    }

    input {
      max-width: 300px;
    }
  }
}

.no-results {
  text-align: center;
  margin: 3rem;
  color: var(--dim);
}
</style>
