import { createSelector } from 'reselect';

const planSelector = state => state.plan.migPlanList.map(p => p);

// const currentPlanSelector = state => state.plan.currentPlan;
const getCurrentPlan = state => state.plan.currentPlan;

const getMigMeta = state => state.migMeta;


const getPlansWithStatus = createSelector(
  [planSelector],
  plans => {

    const plansWithStatus = plans.map(plan => {
      let hasReadyCondition = null;
      let hasPlanError = null;
      let hasPrevMigrations = null;
      let hasRunningMigrations = null;
      let finalMigrationComplete = null;
      let hasAttemptedMigration = null;
      let hasSucceededMigration = null;
      let hasSucceededStage = null;
      let hasClosedCondition = null;
      const hasMigrationError = null;
      let latestType = null;
      let latestIsFailed = false;
      if (!plan.MigPlan.status || !plan.MigPlan.status.conditions) {
        const emptyStatusObject = {
          hasSucceededStage,
          hasPrevMigrations,
          hasClosedCondition,
          hasReadyCondition,
          hasNotReadyCondition: hasPlanError,
          hasRunningMigrations,
          hasSucceededMigration,
          finalMigrationComplete,
          hasFailedCondition: hasMigrationError,
          latestType,
        };
        return { ...plan, PlanStatus: emptyStatusObject };
      }
      hasClosedCondition = !!plan.MigPlan.status.conditions.filter(c => c.type === 'Closed').length;
      hasReadyCondition = !!plan.MigPlan.status.conditions.filter(c => c.type === 'Ready').length;
      hasPlanError = !!plan.MigPlan.status.conditions.filter(c => c.category === 'Critical')
        .length;

      if (plan.Migrations.length) {
        const latest = plan.Migrations[0];

        hasPrevMigrations = !!plan.Migrations.length;
        latestType = latest.spec.stage ? 'Stage' : 'Migration';

        if (latest.status && latest.status.conditions) {
          latestIsFailed = !!(latest.status.conditions.some(c => c.type === 'Failed'));
        }

        hasSucceededStage = !!plan.Migrations.filter(m => {
          if (m.status && m.spec.stage) {
            return m.status.conditions.some(c => c.type === 'Succeeded');
          }
        }).length;

        hasSucceededMigration = !!plan.Migrations.filter(m => {
          if (m.status && !m.spec.stage) {
            return m.status.conditions.some(c => c.type === 'Succeeded');
          }
        }).length;

        hasAttemptedMigration = !!plan.Migrations.some(m => !m.spec.stage);

        finalMigrationComplete = !!plan.Migrations.filter(m => {
          if (m.status) {
            return m.spec.stage === false && hasSucceededMigration;
          }
        }).length;

        hasRunningMigrations = !!plan.Migrations.filter(m => {
          if (m.status) {
            return m.status.conditions.some(c => c.type === 'Running');
          }
        }).length;
      }

      const statusObject = {
        hasSucceededStage,
        hasPrevMigrations,
        hasClosedCondition,
        hasReadyCondition,
        hasNotReadyCondition: hasPlanError,
        hasRunningMigrations,
        hasSucceededMigration,
        finalMigrationComplete,
        hasFailedCondition: hasMigrationError,
        latestType,
      };

      return { ...plan, PlanStatus: statusObject };
    });

    return plansWithStatus;
  }
);

const getCurrentPlanWithStatus = createSelector(
  [getCurrentPlan],
  plan => {
    if (!plan) { return null; };
    let hasReadyCondition = null;
    let hasPlanError = null;
    let hasPrevMigrations = null;
    let hasRunningMigrations = null;
    let finalMigrationComplete = null;
    let hasAttemptedMigration = null;
    let hasSucceededMigration = null;
    let hasSucceededStage = null;
    let hasClosedCondition = null;
    const hasMigrationError = null;
    let latestType = null;
    let latestIsFailed = false;
    if (!plan.MigPlan.status || !plan.MigPlan.status.conditions) {
      const emptyStatusObject = {
        hasSucceededStage,
        hasPrevMigrations,
        hasClosedCondition,
        hasReadyCondition,
        hasNotReadyCondition: hasPlanError,
        hasRunningMigrations,
        hasSucceededMigration,
        finalMigrationComplete,
        hasFailedCondition: hasMigrationError,
        latestType,
      };
      return { ...plan, PlanStatus: emptyStatusObject };
    }
    hasClosedCondition = !!plan.MigPlan.status.conditions.filter(c => c.type === 'Closed').length;
    hasReadyCondition = !!plan.MigPlan.status.conditions.filter(c => c.type === 'Ready').length;
    hasPlanError = !!plan.MigPlan.status.conditions.filter(c => c.category === 'Critical')
      .length;

    if (plan.Migrations.length) {
      const latest = plan.Migrations[0];

      hasPrevMigrations = !!plan.Migrations.length;
      latestType = latest.spec.stage ? 'Stage' : 'Migration';

      if (latest.status && latest.status.conditions) {
        latestIsFailed = !!(latest.status.conditions.some(c => c.type === 'Failed'));
      }

      hasSucceededStage = !!plan.Migrations.filter(m => {
        if (m.status && m.spec.stage) {
          return m.status.conditions.some(c => c.type === 'Succeeded');
        }
      }).length;

      hasSucceededMigration = !!plan.Migrations.filter(m => {
        if (m.status && !m.spec.stage) {
          return m.status.conditions.some(c => c.type === 'Succeeded');
        }
      }).length;

      hasAttemptedMigration = !!plan.Migrations.some(m => !m.spec.stage);

      finalMigrationComplete = !!plan.Migrations.filter(m => {
        if (m.status) {
          return m.spec.stage === false && hasSucceededMigration;
        }
      }).length;

      hasRunningMigrations = !!plan.Migrations.filter(m => {
        if (m.status) {
          return m.status.conditions.some(c => c.type === 'Running');
        }
      }).length;
    }

    const statusObject = {
      hasSucceededStage,
      hasPrevMigrations,
      hasClosedCondition,
      hasReadyCondition,
      hasNotReadyCondition: hasPlanError,
      hasRunningMigrations,
      hasSucceededMigration,
      finalMigrationComplete,
      hasFailedCondition: hasMigrationError,
      latestType,
    };

    return { ...plan, PlanStatus: statusObject };
  });


const getCounts = createSelector(
  [planSelector],
  plans => {
    const counts = {
      notStarted: [],
      inProgress: [],
      completed: [],
    };

    plans.filter((plan = []) => {
      let hasErrorCondition = null;
      let hasRunningMigrations = null;
      let hasSucceededMigration = null;
      if (!plan.MigPlan.status || !plan.MigPlan.status.conditions) {
        counts.notStarted.push(plan);
        return;
      }
      hasErrorCondition = !!plan.MigPlan.status.conditions.some(c => c.category === 'Critical');

      if (plan.Migrations.length) {
        hasRunningMigrations = !!plan.Migrations.filter(m => {
          if (m.status) {
            return m.status.conditions.some(c => c.type === 'Running');
          }
        }).length;

        hasSucceededMigration = !!plan.Migrations.filter(m => {
          if (m.status) {
            return m.status.conditions.some(c => c.type === 'Succeeded');
          }
        }).length;

        if (hasRunningMigrations) {
          counts.inProgress.push(plan);
        } else if (hasSucceededMigration) {
          counts.completed.push(plan);
        } else {
          counts.notStarted.push(plan);
        }
      } else {
        counts.notStarted.push(plan);
      }
    });
    return counts;
  }
);

// const getPlanDiffSelector = createSelector(
//   [planSelector, currentPlanSelector],
//   (plans, currentPlan) => {
//     if (currentPlan) {
//       const foundPlan = plans.find(p => p.MigPlan.metadata.name === currentPlan.MigPlan.metadata.name);
//       //remove controller update fields
//       if (foundPlan) {
//         const { metadata } = foundPlan.MigPlan;
//         if (metadata.annotations || metadata.generation || metadata.resourceVersion) {
//           delete metadata.annotations;
//           delete metadata.generation;
//           delete metadata.resourceVersion;
//         }
//         if (foundPlan.MigPlan.status && foundPlan.MigPlan.status.conditions) {
//           for (let i = 0; foundPlan.MigPlan.status.conditions.length > i; i++) {
//             delete foundPlan.MigPlan.status.conditions[i].lastTransitionTime;
//           }
//         }
//         if (JSON.stringify(currentPlan.MigPlan) === JSON.stringify(foundPlan.MigPlan)) {
//           return currentPlan;
//         } else if
//           (JSON.stringify(currentPlan.MigPlan) !== JSON.stringify(foundPlan.MigPlan)) {
//           return foundPlan;
//         }
//       } else {
//         return null;
//       }

//     }
//   }
// );

// const getCurrentPlan = createSelector(
//   [getPlanDiffSelector],
//   plan => plan);


export default {
  getCurrentPlanWithStatus,
  getPlansWithStatus,
  getMigMeta,
  getCounts,
};
